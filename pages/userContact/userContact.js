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
		isFirstLoadAllStandard:['getMainData','getAboutData','getAboutDataTwo']
	},

	onLoad() {
		const self = this;
		api.commonInit(self);
		self.getMainData();
		self.getAboutData();
		self.getAboutDataTwo()
	},

	getMainData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			title:'客服电话'
		}
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData = res.info.data[0]
			}
			self.setData({
				web_mainData: self.data.mainData,
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self)
		};
		api.labelGet(postData, callback);
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
					title: ['=', ['用户服务协议']],
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
	
	getAboutDataTwo() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			thirdapp_id: 2,
		};
		postData.getBefore = {
			label: {
				tableName: 'Label',
				searchItem: {
					title: ['=', ['隐私政策']],
				},
				middleKey: 'menu_id',
				key: 'id',
				condition: 'in'
			},
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.aboutDataTwo = res.info.data[0];
				self.data.aboutDataTwo.content = api.wxParseReturn(res.info.data[0].content).nodes;
			}
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getAboutDataTwo', self);
			self.setData({
				web_aboutDataTwo: self.data.aboutDataTwo,
			});
		};
		api.articleGet(postData, callback);
	},
	
	  rule(e) {
		const self = this;
		self.data.is_rule = !self.data.is_rule;
		self.setData({
		  is_rule: self.data.is_rule
		})
	  },
  statement(e) {
    const self = this;
    self.data.is_statement = !self.data.is_statement;
    self.setData({
      is_statement: self.data.is_statement
    })
  },
	bindInputChange(e) {
		const self = this;
		api.fillChange(e, self, 'sForm');
		self.setData({
			web_sForm: self.data.sForm,
		});
	},

	phoneCall() {
		const self = this;
		wx.makePhoneCall({
			phoneNumber: self.data.mainData.description,
		})
	},

	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},

})
