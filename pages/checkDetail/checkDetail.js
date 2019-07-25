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
		mainData: [],
		searchItem: {
		},
		isFirstLoadAllStandard: ['getMainData']
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.data.id = options.id;
		self.getMainData();

	},



	getMainData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			id:self.data.id
		}
		postData.getAfter = {
			shopInfo:{
				tableName:'ShopInfo',
				middleKey:'shop_no',
				key:'user_no',
				searchItem:{
					status:1
				},
				condition:'=',
				info:['name']
			}
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData = res.info.data[0];
			}
			self.setData({
				web_mainData: self.data.mainData,
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self)
		};
		api.flowLogGet(postData, callback);
	},




	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},

})
