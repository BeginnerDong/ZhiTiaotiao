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
		
		
		
	
		pArray: [],
		cArray: [],
		mainData: [],
		isFirstLoadAllStandard: ['getMainData']
	},

	onLoad() {
		const self = this;
		api.commonInit(self);
		self.userInfoGet();
		self.getMainData();
		

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
					if (api.findItemInArray(self.data.cArray, 'name', self.data.mainData[i].city) == false) {
						self.data.cArray.push({
							name: self.data.mainData[i].city,
							value: self.data.mainData[i].city_no
						})
					}
				}
			}
			self.setData({

				web_pArray: self.data.pArray,
				web_mainData: self.data.mainData
			});
			self.getBankData();
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		};
		api.areaGet(postData, callback);
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
			self.hfInfoGet()
			console.log('self.data.bankData',self.data.bankData)
		};
		api.labelGet(postData, callback);
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
				
			};
			self.setData({
				web_userInfoData:self.data.userInfoData
			})
		};
		api.userInfoGet(postData, callback);
	},

	hfInfoGet() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getAgentToken';
		const callback = (res) => {
			if (res.solely_code == 100000) {
				self.data.hfInfoData = res.info.data[0];
				
				
				for (var i = 0; i < self.data.bankData.length; i++) {
					if(self.data.bankData[i].value==self.data.hfInfoData.bank_id){
						self.data.hfInfoData.bank_id = self.data.bankData[i].name
					}
				};
				for (var i = 0; i < self.data.pArray.length; i++) {
					if(self.data.pArray[i].value==self.data.hfInfoData.bank_prov){
						self.data.hfInfoData.bank_prov = self.data.pArray[i].name
					}
				};
				for (var i = 0; i < self.data.cArray.length; i++) {
					if(self.data.cArray[i].value==self.data.hfInfoData.bank_area){
						self.data.hfInfoData.bank_area = self.data.cArray[i].name
					}
				}
				for (var i = 0; i < self.data.pArray.length; i++) {
					if(self.data.pArray[i].value==self.data.hfInfoData.cust_prov){
						self.data.hfInfoData.cust_prov = self.data.pArray[i].name
					}
				};
				for (var i = 0; i < self.data.cArray.length; i++) {
					if(self.data.cArray[i].value==self.data.hfInfoData.cust_area){
						self.data.hfInfoData.cust_area = self.data.cArray[i].name
					}
				};
			};
			self.setData({
				web_hfInfoData:self.data.hfInfoData
			})
		};
		api.hfInfoGet(postData, callback);
	},






	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},


})
