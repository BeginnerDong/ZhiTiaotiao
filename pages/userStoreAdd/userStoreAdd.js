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
		buttonCanClick: true,
		submitData: {
			title: '',
			mainImg: [],
			bannerImg: [],
			category_id: 7,
			price: '',
			score: '',

		}
	},

	onLoad() {
		const self = this;
		self.setData({
			web_submitData: self.data.submitData,
			web_buttonCanClick: self.data.buttonCanClick
		})
	},

	deleteImg(e) {
		const self = this;
		var index = api.getDataSet(e, 'index');
		var type = api.getDataSet(e, 'type');
		if (type == 'mainImg') {
			self.data.submitData.mainImg.splice(index, 1);
		} else if (type == 'bannerImg') {
			self.data.submitData.bannerImg.splice(index, 1);
		};
		console.log(self.data.submitData);
		self.setData({
			web_submitData: self.data.submitData
		})
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
					type: 'image'
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
			count: 9,
			success: function(res) {
				console.log(res);
				var tempFilePaths = res.tempFilePaths;
				console.log(callback)
				for (var i = 0; i < tempFilePaths.length; i++) {
					api.uploadFile(tempFilePaths[i], 'file', {
						tokenFuncName: 'getStoreToken',
						type:'image'
					}, callback)
				}
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
					type: 'image'
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
					type: 'image'
				}, callback)
			},
			fail: function(err) {
				wx.hideLoading();
			}
		})
	},

	productAdd() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getStoreToken';
		postData.data = {};
		postData.data = api.cloneForm(self.data.submitData);
		const callback = (data) => {
			if (data.solely_code == 100000) {
				api.buttonCanClick(self, true);
				api.showToast('添加成功', 'none')
				self.data.submitData = {
					title: '',
					mainImg: [],
					bannerImg: [],
					category_id: 7,
					price: '',
					score: ''
				};
				self.setData({
					web_submitData: self.data.submitData,
				});
			} else {
				api.showToast('网络故障', 'none')
			};
		};
		api.productAdd(postData, callback);
	},

	submit() {
		const self = this;
		api.buttonCanClick(self);
		var newObject = api.cloneForm(self.data.submitData);
		
		delete newObject.bannerImg;
		const pass = api.checkComplete(newObject);
		console.log('pass', pass)
		if (pass) {
			self.productAdd()
		} else {
			api.buttonCanClick(self, true);
			api.showToast('请补全信息', 'none');
		};
	},

	bindInputChange(e) {
		const self = this;
		console.log(e);
		var key = e.target.dataset.key;
		api.fillChange(e, self, 'submitData');
	/* 	if(key=="score"||key=="price"){
			if(self.data.submitData[key]!=''){
				var name = self.data.submitData[key];
				
				if(!/^[0-9]{1,9}([.]{1}[0-9]{1,2})?$/.test(name)){
					api.buttonCanClick(self, true);
					api.showToast('价格格式错误', 'none');
					if(key=='score'){
						self.data.submitData.score=''
					}else if(key=='price'){
						self.data.submitData.price=''
					}
					self.setData({
						web_submitData: self.data.submitData,
					});
					return
				};
			}
			
		} */
		console.log(self.data.submitData)
		self.setData({
			web_submitData: self.data.submitData,
		});
		
		
		
	},


	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},

})
