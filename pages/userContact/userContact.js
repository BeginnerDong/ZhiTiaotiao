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
		isFirstLoadAllStandard:['getMainData']
	},

	onLoad() {
		const self = this;
		api.commonInit(self);
		self.getMainData()
	},

	getMainData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			title:'知条条客服'
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
