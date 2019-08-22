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
		currentId: 0,
		isFirstLoadAllStandard: ['getMainData'],
		getBefore: {}
	},

	onLoad(options) {
		const self = this;
		wx.setNavigationBarTitle({
			title: '店铺会员'
		});
		api.commonInit(self);
		self.getMainData();
		self.setData({
			web_currentId: self.data.currentId
		})
	},


	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self);
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.tokenFuncName = 'getStoreToken';
		postData.searchItem = api.cloneForm(self.data.searchItem);
		postData.searchItem.parent_no = wx.getStorageSync('storeInfo').user_no;
		postData.order = {
			create_time: 'desc',
		};
		if (JSON.stringify(api.cloneForm(self.data.getBefore)) != "{}") {
			postData.getBefore = api.cloneForm(self.data.getBefore);
		};
		postData.getAfter = {
			userInfo: {
				tableName: 'User',
				middleKey: 'child_no',
				key: 'user_no',
				searchItem: {
					status: 1
				},
				condition: '=',
				info: ['nickname', 'headImgUrl']
			}
		};

		const callback = (res) => {
			api.buttonCanClick(self,true);
			if (res.info.data.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data);
			} else {
				self.data.isLoadAll = true;
			};
			self.setData({
				web_total: res.info.total,
				web_mainData: self.data.mainData,
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self)
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

	tab(e) {
		const self = this;
		var data = new Date(); //本月
		data.setDate(1);
		data.setHours(0);
		data.setSeconds(0);
		data.setMinutes(0);
		self.data.mainData = [];
		self.setData({
			web_mainData:self.data.mainData
		});
		var monthStart = parseInt(data.getTime() / 1000);
		var dayStart = new Date(new Date().setHours(0, 0, 0, 0)).getTime() / 1000;
		var nowTime = (new Date()).getTime() / 1000;
		console.log('monthStart', monthStart)
		console.log('dayStart', dayStart)
		console.log('nowTime', nowTime)
		if (self.data.currentId != api.getDataSet(e, 'id')) {
			api.buttonCanClick(self);
			self.data.currentId = api.getDataSet(e, 'id');
			if (self.data.currentId == 1) {
				self.data.searchItem.create_time = ['between', [dayStart, nowTime]]
			} else if (self.data.currentId == 2) {
				self.data.getBefore = {};
				self.data.searchItem.create_time = ['between', [monthStart, nowTime]]
			} else if (self.data.currentId == 3) {
				self.data.searchItem.create_time = ['between', [monthStart, nowTime]],
					self.data.getBefore.relation = {
						tableName: 'FlowLog',
						searchItem: {
							status: ['in', [1]]
						},
						fixSearchItem: {
							user_no: ['in', [wx.getStorageSync('info').user_no]],
							type: ['in', 3],

						},
						middleKey: 'child_no',
						key: 'user_no',
						condition: 'in',
					}
			} else if (self.data.currentId == 0) {
				self.data.searchItem = {},
					self.data.getBefore = {}
			};
			self.getMainData(true);
			self.setData({
				web_currentId: self.data.currentId
			})
		};
	},


	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},

})
