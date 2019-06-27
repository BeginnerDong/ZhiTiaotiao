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
		isFirstLoadAllStandard: ['getQrData', 'getMainData'],
		QrData: [],
		is_rule: false
	},

	onLoad() {
		const self = this;
		api.commonInit(self);
		self.getQrData();
		self.getMainData();
		self.getAboutData()
	},

	getMainData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData = res.info.data[0];
			};
			self.setData({
				web_mainData: self.data.mainData
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		};
		api.userInfoGet(postData, callback);
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
					title: ['=', ['会员规则']],
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


	getQrData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getStoreToken'
		postData.qrInfo = {
			scene: wx.getStorageSync('info').user_no,
			path: 'pages/userPayment/userPayment',
		};
		postData.output = 'url';
		postData.ext = 'png';
		const callback = (res) => {
			if (res.solely_code == 100000) {
				self.data.QrData = res;
			} else {
				api.showToast(res.msg, 'none')
			}
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getQrData', self)
			self.setData({
				web_QrData: self.data.QrData,
			});
		};
		api.getQrCode(postData, callback);
	},

	rule() {
		const self = this;
		self.data.is_rule = !self.data.is_rule;
		self.setData({
			is_rule: self.data.is_rule
		})
	},

	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},

})
