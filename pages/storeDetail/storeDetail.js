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
		background: ['/images/banner.jpg', '/images/banner.jpg', '/images/banner.jpg'],
		indicatorDots: false,
		vertical: false,
		autoplay: true,
		circular: true,
		interval: 2000,
		duration: 500,
		previousMargin: 0,
		nextMargin: 0,
		currentId: 0,
		isFirstLoadAllStandard: ['getMainData','getProductData'],
		productData:[]
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
			id: self.data.id,
			user_type: 1
		};
		postData.getAfter = {
			followMe: {
				tableName: 'Log',
				middleKey: 'id',
				key: 'relation_id',
				searchItem: {
					status: ['in', [1, -1]],
					user_no: wx.getStorageSync('info').user_no,
					type: 5
				},
				condition: '='
			},
			goodMe: {
				tableName: 'Log',
				middleKey: 'id',
				key: 'relation_id',
				searchItem: {
					status: ['in', [1, -1]],
					type: 4,
					user_no: wx.getStorageSync('info').user_no
				},
				condition: '='
			},
		}
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData = res.info.data[0];
			};
			self.setData({
				web_mainData: self.data.mainData
			});
			self.getProductData();
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		};
		api.shopInfoGet(postData, callback);
	},
	
	phoneCall() {
		const self = this;
		wx.makePhoneCall({
			phoneNumber: self.data.mainData.phone,
		})
	},
	
	intoMap() {
		const self = this;
		wx.getLocation({
			type: 'gcj02', //返回可以用于wx.openLocation的经纬度
			success: function(res) { //因为这里得到的是你当前位置的经纬度
				var latitude = res.latitude
				var longitude = res.longitude
				wx.openLocation({ //所以这里会显示你当前的位置
					// longitude: 109.045249,
					// latitude: 34.325841,
					longitude: parseFloat(self.data.mainData.longitude),
					latitude: parseFloat(self.data.mainData.latitude),
					name: self.data.mainData.name,
					address: self.data.mainData.address,
					scale: 28
				})
			}
		})
	},

	clickGood(e) {
		const self = this;
		api.buttonCanClick(self);
		if (self.data.mainData.goodMe.length == 0) {
			self.addGoodLog()
		} else {
			self.updateGoodLog()
		};
	},

	addGoodLog() {
		const self = this;
		const postData = {};
		postData.data = {
			type: 4,
			title: '点赞成功',
			relation_id: self.data.mainData.id,
			user_no: wx.getStorageSync('info').user_no,
		};
		postData.tokenFuncName = 'getProjectToken';
		const callback = (res) => {
			if (res.solely_code == 100000) {
				self.data.mainData.goodMe.push({
					status: 1,
					id: res.info.id
				});

			} else {
				api.showToast('点赞失败', 'none', 1000)
			};
			api.buttonCanClick(self, true);
			self.setData({
				web_mainData: self.data.mainData
			});
		};
		api.logAdd(postData, callback);
	},


	updateGoodLog() {
		const self = this;

		const postData = {
			searchItem: {
				id: self.data.mainData.goodMe[0].id,
				status:self.data.mainData.goodMe[0].status
			},
			data: {
				status: -self.data.mainData.goodMe[0].status
			}
		};
		postData.tokenFuncName = 'getProjectToken';
		const callback = (res) => {
			api.buttonCanClick(self, true);
			if (res.solely_code == 100000) {
				self.data.mainData.goodMe[0].status = -self.data.mainData.goodMe[0].status;

			} else {
				api.showToast(res.msg, 'none', 1000)
			};
			self.setData({
				web_mainData: self.data.mainData
			})

		};
		api.logUpdate(postData, callback);
	},

	clickFollow(e) {
		const self = this;
		api.buttonCanClick(self);
		if (self.data.mainData.followMe.length == 0) {
			self.addFollowLog()
		} else {
			self.updateFollowLog()
		};
	},

	addFollowLog() {
		const self = this;
		const postData = {};
		postData.data = {
			type: 5,
			title: '关注成功',
			relation_id: self.data.mainData.id,
			user_no: wx.getStorageSync('info').user_no,
		};
		postData.tokenFuncName = 'getProjectToken';
		const callback = (res) => {
			if (res.solely_code == 100000) {
				self.data.mainData.followMe.push({
					status: 1,
					id: res.info.id
				});

			} else {
				api.showToast(res.msg, 'none', 1000)
			};
			api.buttonCanClick(self, true);
			self.setData({
				web_mainData: self.data.mainData
			});
		};
		api.logAdd(postData, callback);
	},


	updateFollowLog() {
		const self = this;

		const postData = {
			searchItem: {
				id: self.data.mainData.followMe[0].id,
				status:self.data.mainData.followMe[0].status
			},
			data: {
				status: -self.data.mainData.followMe[0].status
			}
		};
		postData.tokenFuncName = 'getProjectToken';
		const callback = (res) => {
			api.buttonCanClick(self, true);
			if (res.solely_code == 100000) {
				self.data.mainData.followMe[0].status = -self.data.mainData.followMe[0].status;

			} else {
				api.showToast(res.msg, 'none', 1000)
			};
			self.setData({
				web_mainData: self.data.mainData
			})

		};
		api.logUpdate(postData, callback);
	},

	getProductData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self)
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {

			user_no: self.data.mainData.user_no
		};
		postData.order = {
			create_time: 'desc'
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.productData.push.apply(self.data.productData, res.info.data);
			} else {
				self.data.isLoadAll = true;
				api.showToast('没有更多了', 'none')
			}
			self.setData({
				web_productData: self.data.productData
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getProductData', self);
		};
		api.productGet(postData, callback);
	},


	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll) {
			self.data.paginate.currentPage++;
			self.getMainData();
		};
	},

	tabs(e) {
		this.setData({
			currentId: e.currentTarget.dataset.id
		})
	},

	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},

})
