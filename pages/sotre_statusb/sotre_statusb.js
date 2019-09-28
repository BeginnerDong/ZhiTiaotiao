import {
	Api
} from '../../utils/api.js';
var api = new Api();

import {
	Token
} from '../../utils/token.js';
var token = new Token();

Page({

	data: {
		is_edit: true,
		submitData: {
			name: '',
			owner: '',
			bannerImg: [],
			phone: '',
			csphone: '',
			description: '',
			
			mainImg: [],
			address: '',
			is_show:1
		},
		isFirstLoadAllStandard: ['getMainData']
	},

	onLoad() {
		const self = this;
		api.commonInit(self);
		self.getMainData();
		self.setData({
			web_submitData:self.data.submitData
		})
	},


	onShow() {
		const self = this;

	},

	getMainData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getStoreToken';
		postData.searchItem = {
			user_no:wx.getStorageSync('storeInfo').user_no
		};
		postData.getAfter = {
			user:{
				tableName:'User',
				middleKey:'user_no',
				key:'user_no',
				searchItem:{
					status:1
				},
				condition:'='
			}
		};
		const callback = (res) => {
			self.data.mainData = {};
			if (res.info.data.length > 0) {
				self.data.mainData = res.info.data[0];
				self.data.submitData.phone = res.info.data[0].user[0].login_name;
				self.data.submitData.name = res.info.data[0].name;
				self.data.submitData.owner = res.info.data[0].owner;
				self.data.submitData.csphone = res.info.data[0].csphone;
				self.data.submitData.description = res.info.data[0].description;
				self.data.submitData.bannerImg = res.info.data[0].bannerImg;
				self.data.submitData.mainImg = res.info.data[0].mainImg;
				
				self.data.submitData.address = res.info.data[0].address;
			};
			self.setData({
				web_submitData: self.data.submitData,
				web_mainData: self.data.mainData
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		};
		api.shopInfoGet(postData, callback);
	},

	shopInfoUpdate() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getStoreToken';
		postData.data = {};
		postData.data = api.cloneForm(self.data.submitData);
		const callback = (data) => {
			if (data.solely_code == 100000) {
				api.buttonCanClick(self, true);
				api.showToast('完善成功', 'none')
				setTimeout(function() {
					wx.navigateBack({
						delta: 1
					});
				}, 300);
			} else {
				api.showToast('网络故障', 'none')
			};

		};
		api.shopInfoUpdate(postData, callback);
	},

	upLoadBannerImg() {
		const self = this;
		if (self.data.submitData.bannerImg.length > 9) {
			api.showToast('仅限10张', 'fail');
			return;
		};
		wx.showLoading({
			mask: true,
			title: '图片上传中',
		});
		const callback = (res) => {
			console.log('res', res)
			if (res.solely_code == 100000) {

				self.data.submitData.bannerImg.push({
					url: res.info.url,
					type:'image'
				})
				self.setData({
					web_submitData: self.data.submitData
				});
				wx.hideLoading()
				console.log('self.data.submitData', self.data.submitData)
			} else {
				api.showToast('网络故障', 'none')
			}
		};

		wx.chooseImage({
			count: 1,
			success: function(res) {
				console.log(res);
				var tempFilePaths = res.tempFilePaths;
				console.log(callback)
				api.uploadFile(tempFilePaths[0], 'file', {
					tokenFuncName: 'getStoreToken',
					type:'image'
				}, callback)
			},
			fail: function(err) {
				wx.hideLoading();
			}
		})
	},

	upLoadMainImg() {
		const self = this;
		if (self.data.submitData.mainImg.length > 2) {
			api.showToast('仅限3张', 'fail');
			return;
		};
		wx.showLoading({
			mask: true,
			title: '图片上传中',
		});
		const callback = (res) => {
			console.log('res', res)
			if (res.solely_code == 100000) {

				self.data.submitData.mainImg.push({
					url: res.info.url,
					type:'image'
				})
				self.setData({
					web_submitData: self.data.submitData
				});
				wx.hideLoading()
				console.log('self.data.submitData', self.data.submitData)
			} else {
				api.showToast('网络故障', 'none')
			}
		};

		wx.chooseImage({
			count: 1,
			success: function(res) {
				console.log(res);
				var tempFilePaths = res.tempFilePaths;
				console.log(callback)
				api.uploadFile(tempFilePaths[0], 'file', {
					tokenFuncName: 'getStoreToken',
					type:'image'
				}, callback)
			},
			fail: function(err) {
				wx.hideLoading();
			}
		})
	},

	submit() {
		const self = this;
		api.buttonCanClick(self);
		var phone = self.data.submitData.phone;
		var newObject = api.cloneForm(self.data.submitData);
		delete newObject.bannerImg;
		delete newObject.owner;
		delete newObject.name;
		delete newObject.phone;
		delete newObject.address;
		console.log('newObject', newObject)
		const pass = api.checkComplete(newObject);
		console.log('pass', pass)
		if (pass) {
			if (phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {
				api.buttonCanClick(self, true);
				api.showToast('手机格式错误', 'none')
			} else {
				self.shopInfoUpdate();
			}
		} else {
			api.buttonCanClick(self, true);
			api.showToast('请补全信息', 'none');
		};
	},
	
	deleteImg(e){
		const self = this;
		var index = api.getDataSet(e,'index');
		var type = api.getDataSet(e,'type');
		
		if(type=='mainImg'){
			//var url = self.data.submitData.mainImg[index].url;
			
			self.data.submitData.mainImg.splice(index,1);
		}else if(type=='bannerImg'){
			//var url = self.data.submitData.bannerImg[index].url;
			self.data.submitData.bannerImg.splice(index,1);
		};
		/* var imgIdReg = /id(\S*)\./i;
		var id = url.match(imgIdReg)[1];
		console.log('id',id)
		const postData = {
			searchItem:{
				id:id
			}
		};
		const callback = (data) => {
			if (data.solely_code == 100000) {
				
			} else {
				api.showToast(res.msg, 'none')
			};
		};
		api.realDelImg(postData, callback); */
		console.log(self.data.submitData);
		self.setData({
			web_submitData:self.data.submitData
		})
	},

	edit() {
		const self = this;
		self.data.is_edit = !self.data.is_edit
		self.setData({
			is_edit: self.data.is_edit
		})
	},

	changeBind(e) {
		const self = this;
		api.fillChange(e, self, 'submitData');
		self.setData({
			web_submitData: self.data.submitData,
		});
	},


	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},

})
