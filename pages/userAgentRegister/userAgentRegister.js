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
		region: ['陕西省', '西安市', '雁塔区'],
		submitData: {
			name: '',
			password: '',
			phone: '',
			email: '',
			address: '',
			agent_no:'',
			thirdapp_id: 2,
			bill_img:[],
			id_img_back:[],
			id_img_front:[],
			province_id:'',
			city_id:'',
			country_id:'',
			level:3,
			city_no:'',
		},
		mainData:[],
		buttonCanClick:true,
		isFirstLoadAllStandard:['getMainData']
		
	},

	onLoad() {
		const self = this;
		api.commonInit(self);
		self.getMainData();
		self.setData({
			web_submitData:self.data.submitData,
			web_buttonCanClick:self.data.buttonCanClick
		})	
	},
	
	getMainData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			type:4
		};
		postData.order = {
			listorder:'desc'
		};
		const callback = (res) => {
			if(res.info.data.length>0){
				self.data.mainData.push.apply(self.data.mainData,res.info.data)
			};
			self.setData({
				web_mainData: self.data.mainData
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		};
		api.labelGet(postData, callback);
	},
	
	provinceChange(e){
		const self = this;
		self.data.cityIndex = '';
		
		self.data.submitData.province_id = self.data.mainData[e.detail.value].id;
		self.data.provinceIndex = e.detail.value;

		self.setData({
			web_city:'',
			web_country:'',
			web_province:self.data.mainData[e.detail.value].title,
			web_provinceIndex:self.data.provinceIndex,
			
		})
	},
	
	cityChange(e){
		const self = this;
		self.data.submitData.city_id = self.data.mainData[self.data.provinceIndex].child[e.detail.value].id;
		self.data.cityIndex = e.detail.value;
		self.setData({
			web_city:self.data.mainData[self.data.provinceIndex].child[e.detail.value].title,
			web_cityIndex:self.data.cityIndex,
		})
	},
	
	countryChange(e){
		const self = this;
		self.data.submitData.country_id = self.data.mainData[self.data.provinceIndex].child[self.data.cityIndex].child[e.detail.value].id;
		self.data.submitData.city_no = self.data.submitData.country_id;
		self.setData({
			web_country:self.data.mainData[self.data.provinceIndex].child[self.data.cityIndex].child[e.detail.value].title	
		});
		self.data.submitData.address = self.data.mainData[e.detail.value].title+self.data.mainData[self.data.provinceIndex].child[e.detail.value].title+self.data.mainData[self.data.provinceIndex].child[self.data.cityIndex].child[e.detail.value].title
	},

	register() {
		const self = this;
		const postData = {};
		postData.data = api.cloneForm(self.data.submitData)
		const callback = (res) => {
			if (res.solely_code == 100000) {
				api.buttonCanClick(self, true);
				api.showToast('注册成功', 'none', 800);
				setTimeout(function() {
					wx.navigateBack({
						delta: 1
					})
				}, 800)
			} else {
				api.buttonCanClick(self, true);
				api.showToast(res.msg, 'none', 1000);
			};

		};
		api.registerAgent(postData, callback);
	},

	deleteImg(e){
		const self = this;
		var index = api.getDataSet(e,'index');
		var type = api.getDataSet(e,'type');
		console.log(type)
		if(type=='id_img_front'){
			self.data.submitData.id_img_front.splice(index,1);
		}else if(type=='id_img_back'){
			self.data.submitData.id_img_back.splice(index,1);
		}
		else if(type=='bill_img'){
			self.data.submitData.bill_img.splice(index,1);
		};
		console.log(self.data.submitData);
		self.setData({
			web_submitData:self.data.submitData
		})
	},

	submit() {
		const self = this;
		api.buttonCanClick(self);
		var phone = self.data.submitData.phone;
		var password = self.data.submitData.password;
		
		var newObject = api.cloneForm(self.data.submitData);
		delete newObject.email;
		const pass = api.checkComplete(newObject);
		console.log('pass', pass)
		console.log('newObject', newObject)
		if (pass) {
			if(!/^(?=.*?[a-zA-Z])(?=.*?[0-9])[a-zA-Z0-9]{6,16}$/.test(password)){
				api.buttonCanClick(self, true);
				api.showToast('密码格式错误', 'none');
				return
			};
			if (phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {
				api.buttonCanClick(self, true);
				api.showToast('手机格式错误', 'none')
			} else {
				self.register();
			}
		} else {
			api.buttonCanClick(self, true);
			api.showToast('请补全信息', 'none');
		};
	},

	bindInputChange(e) {
		const self = this;
		api.fillChange(e, self, 'submitData');
		console.log('self.data.submitData',self.data.submitData)
		self.setData({
			web_submitData: self.data.submitData,
		});
	},
	
	upLoadidBack() {
		const self = this;
		wx.showLoading({
			mask: true,
			title: '图片上传中',
		});
		const callback = (res) => {
			console.log('res', res)
			if (res.solely_code == 100000) {
	
				self.data.submitData.id_img_back.push({
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
					tokenFuncName: 'getProjectToken',
					type:'image'
				}, callback)
			},
			fail: function(err) {
				wx.hideLoading();
			}
		})
	},
	
	upLoadIdFront() {
		const self = this;
		wx.showLoading({
			mask: true,
			title: '图片上传中',
		});
		const callback = (res) => {
			console.log('res', res)
			if (res.solely_code == 100000) {
	
				self.data.submitData.id_img_front.push({
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
					tokenFuncName: 'getProjectToken',
					type:'image'
				}, callback)
			},
			fail: function(err) {
				wx.hideLoading();
			}
		})
	},


  // 上传代理凭证
	upLoadBillImg() {
		const self = this;
		wx.showLoading({
			mask: true,
			title: '图片上传中',
		});
		const callback = (res) => {
			console.log('res', res)
			if (res.solely_code == 100000) {
	
				self.data.submitData.bill_img.push({
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
					tokenFuncName: 'getProjectToken',
					type:'image'
				}, callback)
			},
			fail: function(err) {
				wx.hideLoading();
			}
		})
	},

	bindRegionChange(e) {
		const self = this;
		console.log(e.detail.value);
		self.data.submitData.address = e.detail.value[0]+e.detail.value[1]+e.detail.value[2]
		self.setData({
			web_submitData: self.data.submitData
		})
	},

	

	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},

})
  