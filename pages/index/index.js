import {
	Api
} from '../../utils/api.js';
var api = new Api();
const app = getApp();


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
		isFirstLoadAllStandard: ['getSliderData', 'getNewShopData', 'getLocation', 'getMessageData', 'getHotShopData'],
		sliderData: [],
		newShopData: [],
		hotShopData: [],
		messageData: [],
		city: '',
		order: {}
	},
	//事件处理函数

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.getSliderData();
		self.getNewShopData();
		self.getHotShopData();
		self.getLocation();
		self.getMessageData()
	},

	getSliderData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			thirdapp_id: getApp().globalData.thirdapp_id
		};
		postData.getBefore = {
			caseData: {
				tableName: 'Label',
				searchItem: {
					title: ['=', ['首页轮播']],
				},
				middleKey: 'parentid',
				key: 'id',
				condition: 'in',
			},
		};
		const callback = (res) => {
			console.log(1000, res);
			if (res.info.data.length > 0) {
				self.data.sliderData.push.apply(self.data.sliderData, res.info.data);

			}
			self.setData({
				web_sliderData: self.data.sliderData,
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getSliderData', self);
		};
		api.labelGet(postData, callback);
	},

	getNewShopData() {
		const self = this;

		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			user_type: 1
		};
		postData.order = {
			create_time: 'desc'
		};

		/* postData.order[orderKey]= orderKey; */
		const callback = (res) => {

			if (res.info.data.length > 0) {
				self.data.newShopData.push.apply(self.data.newShopData, res.info.data)
			};
			self.setData({
				web_newShopData: self.data.newShopData
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getNewShopData', self);
		};
		api.shopInfoGet(postData, callback);
	},

	getHotShopData() {
		const self = this;
		var orderKey = 'view_count * 0.3 + favor_count * 0.3 + follow_count * 0.4';
		self.data.order[orderKey] = 'desc';
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			user_type: 1
		};
		postData.order = api.cloneForm(self.data.order);

		/* postData.order[orderKey]= orderKey; */
		const callback = (res) => {

			if (res.info.data.length > 0) {
				self.data.hotShopData.push.apply(self.data.hotShopData, res.info.data)
			};
			self.setData({
				web_hotShopData: self.data.hotShopData
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getHotShopData', self);
		};
		api.shopInfoGet(postData, callback);
	},

	getMessageData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {};
		postData.searchItem.user_type = ['in', [2]];
		postData.searchItem.type = ['in', [1]];
		postData.order = {
			create_time: 'desc'
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.messageData.push.apply(self.data.messageData, res.info.data);
				for (var i = 0; i < self.data.messageData.length; i++) {
					self.data.messageData[i].content = api.wxParseReturn(res.info.data[i].content).nodes;
				}
			} else {
				self.data.isLoadAll = true;
				api.showToast('没有更多了', 'none')
			}
			self.setData({
				web_messageData: self.data.messageData
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMessageData', self);
		};
		api.messageGet(postData, callback);
	},

	getLocation() {
		const self = this;
		const callback = (res) => {
			if (res) {
				console.log('res', res)
				self.data.city = res.address_component.city
			};
			self.setData({
				web_city: self.data.city
			})
		};
		api.getLocation('reverseGeocoder', callback);
		api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getLocation', self)
	},

	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},


	intoPathRedirect(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'redi');
	},

})
