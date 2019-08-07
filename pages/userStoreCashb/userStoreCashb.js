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
		is_show: false,
		searchItem: {},
		submitData: {
			count: ''
		},
		isFirstLoadAllStandard: ['getUserInfoData', 'getAboutData','getHfInfoData'],
		chooseType:0,
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
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.getUserInfoData()
		self.getAboutData()
		self.getHfInfoData();
		self.setData({
			web_type:self.data.type,
			web_chooseType:self.data.chooseType
		})
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
  
  getHfInfoData() {
  	const self = this;
  	const postData = {};
  	postData.tokenFuncName = 'getStoreToken';
  	postData.searchItem = {
  		user_no:wx.getStorageSync('storeInfo').user_no
  	};
  	const callback = (res) => {
  		if (res.info.data.length > 0) {
  			self.data.hfInfoData = res.info.data[0];
  			self.data.hfInfoData.bank_acct_no = self.data.hfInfoData.bank_acct_no.substring(self.data.hfInfoData.bank_acct_no.length-4);
  			for (var i = 0; i < self.data.bankData.length; i++) {
  				if(self.data.bankData[i].value==self.data.hfInfoData.bank_id){
  					self.data.hfInfoData.bankName = self.data.bankData[i].name
  				}
  			}
  		};
  		self.setData({
  			web_hfInfoData: self.data.hfInfoData
  		})
  		api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getHfInfoData', self);
  	};
  	api.hfInfoGet(postData, callback);
  },

	getUserInfoData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getStoreToken';
		postData.searchItem = {
			user_no:wx.getStorageSync('storeInfo').user_no
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

	flowLogAdd() {
		const self = this

		const postData = {
			data: {
				count: -self.data.submitData.count,
				trade_info: '提现',
				status: 0,
				type: 3,
				thirdapp_id: 2,
				user_no:wx.getStorageSync('storeInfo').user_no,
				withdraw_type:self.data.chooseType,
			}
		};
		postData.tokenFuncName = 'getStoreToken';
		if (self.data.userInfoData.cash_bind_card_id.length == 0) {
			api.buttonCanClick(self, true);
			api.showToast('请绑定银行卡', 'none');
			return;
		};
		const callback = (res) => {
			api.buttonCanClick(self, true)
			if (res.solely_code == 100000) {
				api.showToast('申请成功', 'none');
				setTimeout(function() {
					wx.navigateBack({
						delta: 1
					})
				}, 1000);
			}
		};
		api.flowLogAdd(postData, callback)
	},

	submit() {
		const self = this;
		api.buttonCanClick(self);
		if(parseFloat(self.data.userInfoData.score)<parseFloat(self.data.submitData.count)){
			api.buttonCanClick(self, true);
			
			api.showToast('知条数量不足', 'none');
			return
		};
		const pass = api.checkComplete(self.data.submitData);
		console.log('pass', pass)
		if (pass) {
			if(self.data.chooseType==0){
				api.buttonCanClick(self, true);
				
				api.showToast('请选择提现方式', 'none');
				return
			}
			self.flowLogAdd()
		} else {
			api.buttonCanClick(self, true);

			api.showToast('请输入提现数量', 'none')
		};
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
					title: ['=', ['店铺知条兑换规则']],
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
		self.data.submitData.count = self.data.userInfoData.score;
		self.setData({
			web_submitData: self.data.submitData
		})
	},
  rule() {
    const self = this;
    self.data.is_rule = !self.data.is_rule;
    self.setData({
      is_rule: self.data.is_rule
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
