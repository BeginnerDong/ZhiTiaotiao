import {
	Api
} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {
	Token
} from '../../utils/token.js';
const token = new Token();

Page({
	data: {
		userNoArray: [],
		mainData: [],
		originData: [],
		isFirstLoadAllStandard: ['getMainData', 'getTopData'],
		topData: []
	},
	//事件处理函数


	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.getMainData();
		self.getTopData()
	},

	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self)
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.tokenFuncName = 'getAgentToken';
		postData.searchItem = {
			parent_no: wx.getStorageSync('agentInfo').user_no,
			type: 1,
			level: 2,
		};
		postData.getAfter = {
			shopInfo: {
				tableName: 'ShopInfo',
				middleKey: 'child_no',
				key: 'user_no',
				searchItem: {
					status: 1
				},
				condition: '='
			}
		};
		postData.order = {
			create_time: 'desc'
		}
		const callback = (res) => {
			if (res.solely_code == 100000) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data);
			} else {
				self.data.isLoadAll = true;
			}
			self.setData({
				web_mainData: self.data.mainData
			})
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		};
		api.distributionGet(postData, callback);
	},

	getTopData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getAgentToken';
		postData.searchItem = {
			parent_no: wx.getStorageSync('agentInfo').user_no,
			type: 3,
			level: 1,
		};
		postData.getAfter = {
			shopNum: {
				tableName: 'UserInfo',
				middleKey: 'child_no',
				key: 'user_no',
				searchItem: {
					status: 1
				},
				condition: '=',
				compute: {
					num: ['sum', 'shop_num', {
						status: 1
					}]
				}
			},
			authNum: {
				tableName: 'UserInfo',
				middleKey: 'child_no',
				key: 'user_no',
				searchItem: {
					status: 1
				},
				condition: '=',
				compute: {
					num: ['sum', 'auth_num', {
						status: 1
					}]
				}
			},
			me:{
				tableName: 'UserInfo',
				middleKey: 'parent_no',
				key: 'user_no',
				searchItem: {
					status: 1
				},
				condition: '=',
			}
		};
		const callback = (res) => {
			if (res.solely_code == 100000) {
				self.data.topData.push.apply(self.data.topData, res.info.data);
				self.data.shopCount = 0;
				self.data.authCount = 0;
				for (var i = 0; i < self.data.topData.length; i++) {
					self.data.shopCount += self.data.topData[i].shopNum.num
					self.data.authCount += self.data.topData[i].authNum.num
				}
				console.log('self.data.topData[i].shopNum.num', self.data.topData[0].shopNum.num)
			}
			self.setData({
				web_shopCount: self.data.shopCount,
				web_authCount: self.data.authCount,
				web_topData: self.data.topData
			})
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getTopData', self);
		};
		api.distributionGet(postData, callback);
	},

	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll) {
			self.data.paginate.currentPage++;
			self.getMainData();
		};
	},


	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},

	intoPathRedi(e) {
		const self = this;
		wx.navigateBack({
			delta: 1
		})
	},
	intoPathRedirect(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'redi');
	},

})

  