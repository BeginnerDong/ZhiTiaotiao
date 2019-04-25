import {Api} from '../../utils/api.js';
var api = new Api();

import {Token} from '../../utils/token.js';
var token = new Token();

Page({
	data: {
		mainData: [],
		searchItem: {
			status:['in',[1,0,-1]],
			type:4,
			behavior:2
		},
		isFirstLoadAllStandard: ['getMainData', 'getUserInfoData']
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.getMainData();
		self.getUserInfoData()
	},

	getUserInfoData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getStoreToken';
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

	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self);
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.tokenFuncName = 'getStoreToken';
		postData.searchItem = api.cloneForm(self.data.searchItem)
		postData.order = {
			create_time: 'desc',
		};
		postData.getAfter = {
			shopInfo: {
				tableName: 'User',
				middleKey: 'consumer_no',
				key: 'user_no',
				searchItem: {
					status: 1
				},
				condition: '=',
				info: ['nickname']
			}
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data);
			} else {
				self.data.isLoadAll = true;
				api.showToast('没有更多了', 'none');
			};
			self.setData({
				web_mainData: self.data.mainData,
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self)
		};
		api.flowLogGet(postData, callback);
	},


	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll) {
			self.data.paginate.currentPage++;
			self.getMainData();
		};
	},
  
  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },
  
})

  