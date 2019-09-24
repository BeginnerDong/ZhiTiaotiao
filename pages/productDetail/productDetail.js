import {
	Api
} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {
	Token
} from '../../utils/token.js';
const token = new Token();

//index.js
//获取应用实例
//触摸开始的事件

Page({
	data: {
		indicatorDots: true,
		vertical: false,
		autoplay: true,
		circular: true,
		interval: 2000,
		duration: 1000,
		previousMargin: 0,
		nextMargin: 0,
		swiperIndex: 0,
		isFirstLoadAllStandard: ['getMainData','getShopData']
	},


	onLoad(options) {
		const self = this;
		self.data.id = options.id;
		self.data.shop_id = options.shop_id;
	
		api.commonInit(self);
		self.getMainData();
		self.getShopData()
	},
	
	onShareAppMessage(res) {
		const self = this;
	    if (res.from === 'button') {}
	    return {
			title:self.data.mainData.title,
			path:'/pages/productDetail/productDetail?id='+self.data.mainData.id+'&shop_id='+self.data.shopData.id,
			imageUrl:self.data.mainData.mainImg[0].url,     
	    }
	 },



	getMainData() {
		const self = this;
		const postData = {};

		postData.searchItem = {
			id: self.data.id
		};
		const callback = (res) => {
			api.buttonCanClick(self, true);
			if (res.info.data.length > 0) {
				self.data.mainData = res.info.data[0];
			}
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			self.setData({
				web_mainData: self.data.mainData,
			});

		};
		api.productGet(postData, callback);
	},

	getShopData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			id: self.data.shop_id,
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
				self.data.shopData = res.info.data[0];
			};
			self.setData({
				web_shopData: self.data.shopData
			});
			
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getShopData', self);
		};
		api.shopInfoGet(postData, callback);
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
					longitude: parseFloat(self.data.shopData.longitude),
					latitude: parseFloat(self.data.shopData.latitude),
					name: self.data.shopData.name,
					address: self.data.shopData.address,
					scale: 28
				})
			}
		})
	},
	
	clickGood(e) {
		const self = this;
		api.buttonCanClick(self);
		if (self.data.shopData.goodMe.length == 0) {
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
			relation_id: self.data.shopData.id,
			user_no: wx.getStorageSync('info').user_no,
		};
		postData.tokenFuncName = 'getProjectToken';
		const callback = (res) => {
			if (res.solely_code == 100000) {
				self.data.shopData.goodMe.push({
					status: 1,
					id: res.info.id
				});
				api.showToast('点赞成功', 'none', 1000)
			} else {
				api.showToast('点赞失败', 'none', 1000)
			};
			api.buttonCanClick(self, true);
			self.setData({
				web_shopData: self.data.shopData
			});
		};
		api.logAdd(postData, callback);
	},
	
	
	updateGoodLog() {
		const self = this;
	
		const postData = {
			searchItem: {
				id: self.data.shopData.goodMe[0].id,
				status:self.data.shopData.goodMe[0].status
			},
			data: {
				status: -self.data.shopData.goodMe[0].status
			}
		};
		postData.tokenFuncName = 'getProjectToken';
		const callback = (res) => {
			api.buttonCanClick(self, true);
			if (res.solely_code == 100000) {
				self.data.shopData.goodMe[0].status = -self.data.shopData.goodMe[0].status;
				if(self.data.shopData.goodMe[0].status==1){
					api.showToast('点赞成功', 'none', 1000)
				}else{
					api.showToast('取消成功', 'none', 1000)
				}
			} else {
				api.showToast(res.msg, 'none', 1000)
			};
			self.setData({
				web_shopData: self.data.shopData
			})
	
		};
		api.logUpdate(postData, callback);
	},
	
	clickFollow(e) {
		const self = this;
		api.buttonCanClick(self);
		if (self.data.shopData.followMe.length == 0) {
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
			relation_id: self.data.shopData.id,
			user_no: wx.getStorageSync('info').user_no,
		};
		postData.tokenFuncName = 'getProjectToken';
		const callback = (res) => {
			if (res.solely_code == 100000) {
				self.data.shopData.followMe.push({
					status: 1,
					id: res.info.id
				});
				api.showToast('关注成功', 'none', 1000)
			} else {
				api.showToast(res.msg, 'none', 1000)
			};
			api.buttonCanClick(self, true);
			self.setData({
				web_shopData: self.data.shopData
			});
		};
		api.logAdd(postData, callback);
	},
	
	
	updateFollowLog() {
		const self = this;
	
		const postData = {
			searchItem: {
				id: self.data.shopData.followMe[0].id,
				status:self.data.shopData.followMe[0].status
			},
			data: {
				status: -self.data.shopData.followMe[0].status
			}
		};
		postData.tokenFuncName = 'getProjectToken';
		const callback = (res) => {
			api.buttonCanClick(self, true);
			if (res.solely_code == 100000) {
				self.data.shopData.followMe[0].status = -self.data.shopData.followMe[0].status;
				if(self.data.shopData.followMe[0].status==1){
					api.showToast('关注成功', 'none', 1000)
				}else{
					api.showToast('取消成功', 'none', 1000)
				}
			} else {
				api.showToast(res.msg, 'none', 1000)
			};
			self.setData({
				web_shopData: self.data.shopData
			})
	
		};
		api.logUpdate(postData, callback);
	},
	



	intoPathRedirect(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'redi');
	},
	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	}
})
