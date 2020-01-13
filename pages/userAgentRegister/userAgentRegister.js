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
			//agree_img:[],
			id_img_back:[],
			id_img_front:[],
			province_id:'',
			city_id:'',
			country_id:'',
			level:3,
			city_no:'',
			postal_address:''
		},
		mainData:[],
		buttonCanClick:true,
		isFirstLoadAllStandard:['getMainData'],
		isSelect:false,
		is_rule:false
	},

	onLoad() {
		const self = this;
		api.commonInit(self);
		self.getMainData();
		self.getAboutData();
		self.setData({
			web_isSelect:self.data.isSelect,
			web_submitData:self.data.submitData,
			web_buttonCanClick:self.data.buttonCanClick
		})	
	},
	
	choose(){
		const self = this;
		self.data.isSelect = !self.data.isSelect;
		self.setData({
			web_isSelect:self.data.isSelect
		})
	},
	
	rule() {
	  const self = this;
	  self.data.is_rule = !self.data.is_rule;
	  self.setData({
	    is_rule: self.data.is_rule
	  })
	},
	
	getAboutData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			thirdapp_id: 2,
		};
		postData.getBefore = {
			label: {
				tableName: 'Label',
				searchItem: {
					title: ['=', ['代理协议须知']],
				},
				middleKey: 'menu_id',
				key: 'id',
				condition: 'in'
			},
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.aboutData = res.info.data[0];
				self.data.aboutData.content = api.wxParseReturn(res.info.data[0].content).nodes;
			}
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getAboutData', self);
			self.setData({
				web_aboutData: self.data.aboutData,
			});
		};
		api.articleGet(postData, callback);
	},
	
	previewImg(e) {
		const self = this;
		var key = api.getDataSet(e,'key');
		var index = api.getDataSet(e,'index');
		var urlArray = [];
		console.log(self.data.submitData[key])
		for (var i = 0; i < self.data.submitData[key].length; i++) {
			urlArray.push(self.data.submitData[key][i].url)
		}
		//urlArray.push(self.data.submitData[key].url)
		console.log(index)
		wx.previewImage({
			current: self.data.submitData[key][index].url,
			urls: urlArray,
			success: function(res) {},
			fail: function(res) {},
			complete: function(res) {},
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
		self.data.submitData.city_id = '';
		self.data.submitData.country_id = '';
		self.data.submitData.city_no = '';
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
		self.data.submitData.country_id = '';
		self.data.submitData.city_no = '';
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
		self.data.submitData.address = self.data.mainData[self.data.provinceIndex].title+self.data.mainData[self.data.provinceIndex].child[self.data.cityIndex].title+self.data.mainData[self.data.provinceIndex].child[self.data.cityIndex].child[e.detail.value].title
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
		}else if(type=='agree_img'){
			self.data.submitData.agree_img.splice(index,1);
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
		delete newObject.agent_no;
		const pass = api.checkComplete(newObject);
		console.log('pass', pass)
		console.log('newObject', newObject)
		if (pass) {
			if(!self.data.isSelect){
				api.buttonCanClick(self, true);
				api.showToast('请查看并同意协议内容', 'none');
				return
			};
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
	
	upLoadAgreeImg() {
		const self = this;
		wx.showLoading({
			mask: true,
			title: '图片上传中',
		});
		const callback = (res) => {
			console.log('res', res)
			if (res.solely_code == 100000) {
	
				self.data.submitData.agree_img.push({
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
			count: 9,
			success: function(res) {
				console.log(res);
				var tempFilePaths = res.tempFilePaths;
				console.log(callback)
				for (var i = 0; i < tempFilePaths.length; i++) {
					api.uploadFile(tempFilePaths[i], 'file', {
						tokenFuncName: 'getProjectToken',
						type:'image'
					}, callback)
				}
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
  