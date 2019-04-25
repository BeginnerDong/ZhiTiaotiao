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
		isShowStore: false,
		mainData: [],
		typeData: [],
		isFirstLoadAllStandard: ['getMainData', 'getTypeData', 'getLocation'],
		searchItem: {},
		sForm: {
			keyswords: ''
		},
		La1: '',
		lo1: '',
		order:{}
	},
	//事件处理函数
	preventTouchMove: function(e) {

	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);

		self.getTypeData();
		self.getLocation()
	},

	getMainData(isNew) {
		const self = this;
		var lat = self.data.la1;
		var lon = self.data.lo1;
		var orderKey = 'ACOS(SIN(('+ lat +'* 3.1415) / 180 ) *SIN((latitude * 3.1415) / 180 ) +COS(('+ lat +' * 3.1415) / 180 ) * COS((latitude * 3.1415) / 180 ) *COS(('+ lon +' * 3.1415) / 180 - (longitude * 3.1415) / 180 ) ) * 6379';

		
	
		self.data.order[orderKey]= 'asc';
		if (isNew) {
			api.clearPageIndex(self)
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = api.cloneForm(self.data.searchItem);
		postData.searchItem.user_type = 1
		postData.order = api.cloneForm(self.data.order)
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data);
				for (var i = 0; i < self.data.mainData.length; i++) {
					self.data.mainData[i].distance =
						api.distance(self.data.la1, self.data.lo1, self.data.mainData[i].latitude, self.data.mainData[i].longitude)
					console.log('self.data.mainData[i].distance', self.data.mainData[i].distance)
				}
			} else {
				self.data.isLoadAll = true;
				api.showToast('没有更多了', 'none')
			}
			self.setData({
				web_mainData: self.data.mainData
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		};
		api.shopInfoGet(postData, callback);
	},

	getTypeData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			thirdapp_id: getApp().globalData.thirdapp_id
		};
		postData.getBefore = {
			caseData: {
				tableName: 'Label',
				searchItem: {
					title: ['=', ['门店类别']],
				},
				middleKey: 'parentid',
				key: 'id',
				condition: 'in',
			},
		};
		const callback = (res) => {
			console.log(1000, res);
			if (res.info.data.length > 0) {
				self.data.typeData.push.apply(self.data.typeData, res.info.data);


			}
			self.setData({
				web_typeData: self.data.typeData,
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getTypeData', self);
		};
		api.labelGet(postData, callback);
	},

	changeType(e) {
		const self = this;
		self.data.isShowStore = !self.data.isShowStore;
		self.setData({
			isShowStore: self.data.isShowStore
		});
		var menu_id = api.getDataSet(e, 'id');
		self.data.searchItem = {
			menu_id: menu_id
		};
		self.getMainData(true)
	},

	search() {
		const self = this;
		self.data.searchItem.keyswords = self.data.sForm.keyswords;
		self.getMainData(true)
	},

	bindInputChange(e) {
		const self = this;
		api.fillChange(e, self, 'sForm');
		self.setData({
			web_sForm: self.data.sForm,
		});
	},

	getLocation() {
		const self = this;
		const callback = (res) => {
			if (res) {
				self.data.la1 = res.latitude;
				self.data.lo1 = res.longitude
			};
			self.getMainData();
		};

		api.getLocation('getGeocoder', callback);
		api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getLocation', self)
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

	isShowStore(e) {
		const self = this;

		self.data.isShowStore = !self.data.isShowStore;
		self.setData({
			isShowStore: self.data.isShowStore
		})
	},
	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll) {
			self.data.paginate.currentPage++;
			self.getMainData();
		};
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
