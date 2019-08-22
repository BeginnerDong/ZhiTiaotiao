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
		self.data.day = new Date().getDate();
		console.log(self.data.day)
		self.getUserInfoData()
		self.getAboutData();
		self.getHfInfoData()
		self.setData({
			web_type:self.data.type,
			web_chooseType:self.data.chooseType
		})
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
		if (self.data.day>7) {
			api.buttonCanClick(self, true);
		
			api.showToast('不在提现日期内', 'none');
			return
		};
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
