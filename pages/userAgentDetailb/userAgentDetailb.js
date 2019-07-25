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
		bankData: [{
			name: '兴业银行',
			value: '03090000'
		}, {
			name: '华夏银行',
			value: '03040000'
		}, {
			name: '北京银行',
			value: '03130011'
		}, {
			name: '招商银行',
			value: '03080000'
		}, {
			name: '中国工商银行',
			value: '01020000'
		}, {
			name: '中国建设银行',
			value: '01050000'
		}, {
			name: '中国农业银行',
			value: '01030000'
		}, {
			name: '光大银行',
			value: '03030000'
		}, {
			name: '北京农村商业银行',
			value: '04020011'
		}, {
			name: '中国银行',
			value: '01040000'
		}, {
			name: '中国邮政储蓄银行',
			value: '04030000'
		}, {
			name: '南京银行',
			value: '03133201'
		}, {
			name: '杭州银行',
			value: '03133301'
		}, {
			name: '浙商银行',
			value: '03160000'
		}, {
			name: '上海银行',
			value: '03130031'
		}, {
			name: '渤海银行',
			value: '03180000'
		}, {
			name: '上海农村商业银行',
			value: '04020031'
		}, {
			name: '广东发展银行',
			value: '03060000'
		}, {
			name: '民生银行',
			value: '03050000'
		}, {
			name: '浦东发展银行',
			value: '04020031'
		}, {
			name: '平安银行',
			value: '03134402'
		}, {
			name: '浙江民泰商业银行',
			value: '03133307'
		}, {
			name: '浙江泰隆商业银行',
			value: '31330000'
		}, {
			name: '深圳发展银行',
			value: '03070000'
		}, {
			name: '中信银行',
			value: '03020000'
		}, {
			name: '交通银行',
			value: '03010000'
		}],
		
		
		
	
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
			self.hfInfoGet();
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
