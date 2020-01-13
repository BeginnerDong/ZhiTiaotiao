//logs.js
import {
	Api
} from '../../utils/api.js';
var api = new Api();

import {
	Token
} from '../../utils/token.js';
const token = new Token();

Page({
	data: {
		bankData: [],
		is_show: false,
		searchItem: {},
		submitData: {
			count: ''
		},
		chooseType: 0,
		isFirstLoadAllStandard: ['getUserInfoData', 'getHfInfoData','getAboutData']
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.data.week = new Date().getDay().toString();
		self.getUserInfoData()
		self.getAboutData();
		self.getBankData()
		self.setData({
			web_type:self.data.type,
			web_chooseType:self.data.chooseType
		})
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
				self.getHfInfoData()
			}
			self.setData({
				bankData: self.data.bankData,
			});
		};
		api.labelGet(postData, callback);
	},

	getUserInfoData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getAgentToken';
		postData.searchItem = {
			user_no: wx.getStorageSync('agentInfo').user_no
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.userInfoData = res.info.data[0];
			};
			self.setData({
				web_userInfoData: self.data.userInfoData
			})
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getUserInfoData', self);
		};
		api.userInfoGet(postData, callback);
	},

	getHfInfoData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getAgentToken';
		postData.searchItem = {
			user_no: wx.getStorageSync('agentInfo').user_no
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.hfData = res.info.data[0];
				for (var i = 0; i < self.data.bankData.length; i++) {
					if (self.data.bankData[i].value == self.data.hfData.bank_id) {
						self.data.hfData.bank_name = self.data.bankData[i].name
					}
				}
				self.data.hfData.bank_acct_no = self.data.hfData.bank_acct_no.substring(self.data.hfData.bank_acct_no.length - 4);
			};
			self.setData({
				web_hfData: self.data.hfData
			})
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getHfInfoData', self);
		};
		api.hfInfoGet(postData, callback);
	},
	rule() {
		const self = this;
		self.data.is_rule = !self.data.is_rule;
		self.setData({
			is_rule: self.data.is_rule
		})
	},
	flowLogAdd() {
		const self = this
		const postData = {
			data: {
				count: -self.data.submitData.count,
				trade_info: '提现',
				status: 1,
				type: 5,
				thirdapp_id: 2,
				behavior: 2,
				withdraw_type: self.data.chooseType,
				user_no: wx.getStorageSync('agentInfo').user_no
			}
		};
		postData.tokenFuncName = 'getAgentToken';

		const callback = (res) => {
			api.buttonCanClick(self, true)
			if (res.solely_code == 100000) {
				api.showToast('申请成功', 'none');
				setTimeout(function() {
					wx.navigateBack({
						delta: 1
					})
				}, 1000);
			} else {
				api.showToast(res.msg, 'none');
			}
		};
		api.flowLogAdd(postData, callback)
	},

	submit() {
		const self = this;
		api.buttonCanClick(self);
		if (self.data.week==1||self.data.week==2) {
			const pass = api.checkComplete(self.data.submitData);
			console.log('pass', pass)
			if (pass) {
				if (self.data.chooseType == 0) {
					api.buttonCanClick(self, true);
			
					api.showToast('请选择提现方式', 'none');
					return
				}
				if (parseFloat(self.data.submitData.count) > parseFloat(self.data.userInfoData.benefit)) {
					api.buttonCanClick(self, true);
			
					api.showToast('佣金不足', 'none');
					return
				}
				self.flowLogAdd()
			} else {
				api.buttonCanClick(self, true);
			
				api.showToast('请输入提现金额', 'none')
			};
			
		}else{
			api.buttonCanClick(self, true);
					
			api.showToast('不在提现日期内', 'none');
			return
		}
		
	},

	choose(e) {
		const self = this;
		var type = api.getDataSet(e, 'type');
		if (type != self.data.chooseType) {
			self.data.chooseType = type;
			self.setData({
				web_chooseType: self.data.chooseType
			})
		}
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
					title: ['=', ['佣金提现规则']],
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

	is_show() {
		const self = this;
		self.data.is_show = !self.data.is_show;
		self.setData({
			is_show: self.data.is_show
		})
	},

	allOut() {
		const self = this;
		self.data.submitData.count = self.data.userInfoData.benefit;
		self.setData({
			web_submitData: self.data.submitData
		})
	},

	changeBind(e) {
		const self = this;
		api.fillChange(e, self, 'submitData');
		console.log('self.data.submitData', self.data.submitData)
		self.setData({
			web_submitData: self.data.submitData,
		});
	},


	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},
})
