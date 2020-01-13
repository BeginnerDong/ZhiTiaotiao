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
		bankData: [],
		occupationData: [{
				name: '国家机关、 党群机关、 企事业单位负责人',
				value: '01'
			}, {
				name: '金融业从业人员',
				value: '02'
			}, {
				name: '房地产业从业人员',
				value: '03'
			}, {
				name: '商贸从业人员',
				value: '04'
			}, {
				name: '自由职业者',
				value: '05'
			},
			{
				name: '科教文从业人员',
				value: '06'
			}, {
				name: '制造业从业人员',
				value: '07'
			}, {
				name: '卫生行业从业人员',
				value: '08'
			}, {
				name: 'IT业从业人员',
				value: '09'
			}, {
				name: '农林牧渔劳动者',
				value: '10'
			},
			{
				name: '生产工作、 运输工作和部分体力劳动者',
				value: '11'
			}, {
				name: '退休人员',
				value: '12'
			}, {
				name: '不便分类的其他劳动者',
				value: '13'
			}
		],
		submitData: {
			type: 3,
			user_name: '',
			cert_id: '',
			user_mobile: '',
			/* vali_date: '', */
			cust_prov: '',
			cust_area: '',
			/* cust_address: '', */
			occupation: '',
			
			bank_acct_no: '',
			bank_branch: '',
			bank_prov: '',
			bank_area: '',
			bank_id: ''
		},
		pArray: [],
		pArrayTwo:[],
		cArray: [],
		cArrayTwo:[],
		mainData: [],
		isFirstLoadAllStandard: ['getMainData','getBankData']
	},

	onShow() {
		const self = this;
		api.commonInit(self);
		
		self.hfInfoGet()
		self.getBankData()
	},

	getBankData(){
		const self = this;
		const postData = {};
		postData.searchItem = {
			thirdapp_id: 2,
		};
		postData.getBefore = {
			caseData: {
				tableName: 'Label',
				searchItem: {
					title: ['in', ['个人取现银行列表']],
				},
				middleKey: 'parentid',
				key: 'id',
				condition: 'in',
			},
		};
		postData.order = {
			listorder:'desc'
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				for (var i = 0; i < res.info.data.length; i++) {
					self.data.bankData.push({name:res.info.data[i].title,value:res.info.data[i].description})
				}
			}
			self.setData({
				bankData: self.data.bankData,
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getBankData', self);
			console.log('self.data.bankData',self.data.bankData)
		};
		api.labelGet(postData, callback);
	},
	



	getMainData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			thirdapp_id: 2
		};
		postData.order = {
			id: 'asc'
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data);
				for (var i = 0; i < self.data.mainData.length; i++) {
					if (api.findItemInArray(self.data.pArray, 'name', self.data.mainData[i].province) == false) {
						self.data.pArray.push({
							name: self.data.mainData[i].province,
							value: self.data.mainData[i].province_no
						})
					};
					if (api.findItemInArray(self.data.pArrayTwo, 'name', self.data.mainData[i].province) == false) {
						self.data.pArrayTwo.push({
							name: self.data.mainData[i].province,
							value: self.data.mainData[i].province_no
						})
					};
				}
			}
			self.setData({
				web_pArrayTwo: self.data.pArrayTwo,
				web_pArray: self.data.pArray,
				web_mainData: self.data.mainData
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		};
		api.areaGet(postData, callback);
	},
	
	userInfoGet() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getAgentToken';
		postData.searchItem = {
			user_no:wx.getStorageSync('agentInfo').user_no
		};
		const callback = (res) => {
			if (res.solely_code == 100000) {
				self.data.userInfoData = res.info.data[0];
				if (self.data.hfInfoData.bank_acct_no !=''&&self.data.hfInfoData.type==3&&self.data.userInfoData.check_status==1) {
					wx.redirectTo({
						url:'/pages/userAgentDetailb/userAgentDetailb'
					})
					
				}else if(self.data.hfInfoData.bank_acct_no !=''&&self.data.userInfoData.check_status==2&&self.data.hfInfoData.type==3){
					wx.redirectTo({
						url:'/pages/bank/bank'
					})
				}else if(self.data.userInfoData.check_status==3||self.data.userInfoData.check_status==0){
					self.getMainData();
				}
			};
		};
		api.userInfoGet(postData, callback);
	},

	hfInfoGet() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getAgentToken';
		postData.searchItem = {
			user_no: wx.getStorageSync('agentInfo').user_no
		};
		/* postData.data = api.cloneForm(self.data.submitData); */
		const callback = (res) => {
			if (res.solely_code == 100000) {
				self.data.hfInfoData = res.info.data[0]
				self.data.submitData.user_name = res.info.data[0].user_name
				self.data.submitData.cert_id = res.info.data[0].cert_id
				self.data.submitData.user_mobile = res.info.data[0].user_mobile
	
			
				self.data.submitData.bank_acct_no = res.info.data[0].bank_acct_no
				self.data.submitData.bank_branch = res.info.data[0].bank_branch
		
				self.data.submitData.bank_id = res.info.data[0].bank_id
				self.userInfoGet();
			};	
			
			self.setData({
				web_submitData:self.data.submitData
			})
		};
		api.hfInfoGet(postData, callback);
	},

	changeBind(e) {
		const self = this;
		if (api.getDataSet(e, 'value')) {
			self.data.submitData[api.getDataSet(e, 'key')] = api.getDataSet(e, 'value');
		} else {
			api.fillChange(e, self, 'submitData');
		};
		self.setData({
			web_submitData: self.data.submitData,
		});
		console.log(self.data.submitData)
	},

	hfInfoUpdate() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getAgentToken';
		postData.searchItem = {
			user_no: wx.getStorageSync('agentInfo').user_no
		};
		postData.data = api.cloneForm(self.data.submitData);
		postData.saveAfter = [{
			tableName: 'UserInfo',
			FuncName: 'update',
			data: {
				check_status:1,
				/* bank: self.data.submitData.bank_branch, */
				bank_id: self.data.submitData.bank_id,
				card_no: self.data.submitData.bank_acct_no,
				card_prov: self.data.submitData.bank_prov,
				card_area: self.data.submitData.bank_area,
			},
			searchItem: {
				user_no: wx.getStorageSync('agentInfo').user_no
			}
		}];
		const callback = (res) => {
			if (res.solely_code == 100000) {
				api.showToast('开户成功','none')
				setTimeout(function()
				{
				  wx.redirectTo({
				  	url:'/pages/userAgentDetailb/userAgentDetailb'
				  })
				},500);
				
			}else{
				api.showToast(res.msg,'none')
			}
		};
		api.hfInfoUpdate(postData, callback);
	},
	
	submit() {
		const self = this;
		api.buttonCanClick(self);
		var phone = self.data.submitData.phone;
		const pass = api.checkComplete(self.data.submitData);
		console.log('pass', pass)
		console.log('self.data.submitData', self.data.submitData)
		if (pass) {		
				self.hfInfoUpdate();		
		} else {
			api.buttonCanClick(self, true);
			api.showToast('请补全信息', 'none');
		};
	},
	


	bankChange(e) {
		const self = this;
		console.log('picker发送选择改变，携带值为', e.detail.value)
		self.data.submitData.bank_id = self.data.bankData[e.detail.value].value;
		console.log(self.data.submitData);
		self.setData({
			web_index: e.detail.value,
			web_submitData: self.data.submitData
		})
	},


	occupationChange(e) {
		const self = this;
		console.log('picker发送选择改变，携带值为', e.detail.value)
		self.data.submitData.occupation = self.data.occupationData[e.detail.value].value;
		console.log(self.data.submitData);
		self.setData({
			web_index1: e.detail.value,
			web_submitData: self.data.submitData
		})
	},



	userProvinceChange(e) {
		const self = this;
		console.log('picker发送选择改变，携带值为', e.detail.value)
		self.data.cArrayTwo = [];
		self.data.submitData.cust_prov = self.data.pArrayTwo[e.detail.value].value;
		console.log(self.data.submitData);
		for (var i = 0; i < self.data.mainData.length; i++) {
			if (self.data.mainData[i].province_no == self.data.pArrayTwo[e.detail.value].value&&self.data.mainData[i].type==2) {
				if (api.findItemInArray(self.data.cArrayTwo, 'name', self.data.mainData[i].city) == false) {
					self.data.cArrayTwo.push({
						name: self.data.mainData[i].city,
						value: self.data.mainData[i].city_no
					})
				}
			}
		};
		self.setData({
			web_cArrayTwo: self.data.cArrayTwo,
			web_index5: e.detail.value,
			web_submitData: self.data.submitData
		})
	},

	userCityChange(e) {
		const self = this;
		console.log(self.data.cArrayTwo)
		if (self.data.cArrayTwo.length == 0) {
			api.showToast('请先选择省份', 'none')
			return
		};
		console.log('picker发送选择改变，携带值为', e.detail.value)
		self.data.submitData.cust_area = self.data.cArrayTwo[e.detail.value].value;
		console.log(self.data.submitData);
		self.setData({
			web_index6: e.detail.value,
			web_submitData: self.data.submitData
		})
	},

	provinceChange(e) {
		const self = this;
		console.log('picker发送选择改变，携带值为', e.detail.value)
		self.data.cArray = [];
		self.data.submitData.bank_prov = self.data.pArray[e.detail.value].value;
		console.log(self.data.submitData);
		for (var i = 0; i < self.data.mainData.length; i++) {
			if (self.data.mainData[i].province_no == self.data.pArray[e.detail.value].value&&self.data.mainData[i].type==2) {
				if (api.findItemInArray(self.data.cArray, 'name', self.data.mainData[i].city) == false) {
					self.data.cArray.push({
						name: self.data.mainData[i].city,
						value: self.data.mainData[i].city_no
					})
				}
			}
		};
		self.setData({
			web_cArray: self.data.cArray,
			web_index3: e.detail.value,
			web_submitData: self.data.submitData
		})
	},



	cityChange(e) {
		const self = this;
		console.log(self.data.cArray)
		if (self.data.cArray.length == 0) {
			api.showToast('请先选择省份', 'none')
			return
		};
		console.log('picker发送选择改变，携带值为', e.detail.value)
		self.data.submitData.bank_area = self.data.cArray[e.detail.value].value;
		console.log(self.data.submitData);
		self.setData({
			web_index4: e.detail.value,
			web_submitData: self.data.submitData
		})
	},


	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},


})
