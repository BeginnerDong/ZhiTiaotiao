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
			name: ''
		},
		La1: '',
		lo1: '',
		order: {},
		getBefore: {},
		is_show:false
	},
	//事件处理函数
	preventTouchMove: function(e) {

	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);

		self.getTypeData();
		self.data.is_show = false;
		self.setData({
			is_show: self.data.is_show
		})
		self.getLocation()
	},
	
	onShow(){
		const self = this;
		console.log(22)
		
		
	},
	
	deleteName(){
		const self = this;
		self.data.sForm.name = '',
		self.setData({
			web_sForm:self.data.sForm
		})
	},

	getMainData(isNew) {
		const self = this;
		var lat = self.data.la1;
		var lon = self.data.lo1;
		var orderKey = 'ACOS(SIN((' + lat + '* 3.1415) / 180 ) *SIN((latitude * 3.1415) / 180 ) +COS((' + lat +
			' * 3.1415) / 180 ) * COS((latitude * 3.1415) / 180 ) *COS((' + lon +
			' * 3.1415) / 180 - (longitude * 3.1415) / 180 ) ) * 6379';



		self.data.order[orderKey] = 'asc';
		if (isNew) {
			api.clearPageIndex(self)
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = api.cloneForm(self.data.searchItem);
		postData.searchItem.user_type = 1
		postData.searchItem.is_show = 1;
		postData.order = api.cloneForm(self.data.order)
		if (JSON.stringify(self.data.getBefore) != '{}') {
			postData.getBefore = api.cloneForm(self.data.getBefore);
		}

		const callback = (res) => {
			api.buttonCanClick(self, true);
			wx.hideLoading();
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
			setTimeout(function()
			{
			  wx.hideNavigationBarLoading();
			  wx.stopPullDownRefresh();
			},300);
			self.setData({
				web_mainData: self.data.mainData
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		};
		api.shopInfoGet(postData, callback);
	},
	
	searchShop(isNew) {
		const self = this;
		var lat = self.data.la1;
		var lon = self.data.lo1;
		var orderKey = 'ACOS(SIN((' + lat + '* 3.1415) / 180 ) *SIN((latitude * 3.1415) / 180 ) +COS((' + lat +
			' * 3.1415) / 180 ) * COS((latitude * 3.1415) / 180 ) *COS((' + lon +
			' * 3.1415) / 180 - (longitude * 3.1415) / 180 ) ) * 6379';
		self.data.order[orderKey] = 'asc';
		if (isNew) {
			api.clearPageIndex(self)
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.searchItem = {
			name: self.data.sForm.name
		};
		postData.searchItem.is_show = 1;
		postData.order = api.cloneForm(self.data.order)
		const callback = (res) => {
			api.buttonCanClick(self, true);
			wx.hideLoading();
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
		api.searchShop(postData, callback);
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
					title: ['=', ['店铺分类']],
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
		api.buttonCanClick(self);
		self.data.getBefore = {};
		self.data.sForm.name = '';
		self.data.isShowStore = !self.data.isShowStore;
		self.setData({
			isShowStore: self.data.isShowStore
		});
		var menu_id = api.getDataSet(e, 'id');
		self.data.searchItem = {
			menu_id: menu_id
		};
		self.setData({
			web_sForm:self.data.sForm,
			web_menu_id: menu_id
		})
		self.getMainData(true)
	},

	onPullDownRefresh() {
		const self = this;
		wx.showNavigationBarLoading();
		self.data.getBefore = {};
		delete self.data.searchItem.menu_id;
		self.data.sForm.name = '';
		self.getMainData(true);
		self.setData({
			web_sForm:self.data.sForm,
			web_menu_id: ''
		})

	},

	search() {
		const self = this;
		if (self.data.sForm.name == '') {
			api.showToast('搜索条件无效', 'none');
			return
		};
		if(self.data.searchItem.menu_id){
			delete self.data.searchItem.menu_id;
			self.setData({
				web_menu_id:''
			})
		};
		self.searchShop(true)
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
				console.log(res)
				if(res.authSetting){
					self.data.is_show=true;
					self.setData({
						is_show:self.data.is_show
					})
					api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getLocation', self)
					api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self)
					return
				}
				self.data.la1 = res.latitude;
				self.data.lo1 = res.longitude
				
				/* self.data.la1 = 34.23652;
				self.data.lo1 = 108.89122 */
			};
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getLocation', self)
			self.getMainData(true);
		};

		api.getLocation('getGeocoder', callback);
		
	},
	
	

	
	
	
	cancle(e) {
		const self = this;
		self.data.is_show = false;
		self.setData({
			is_show: self.data.is_show
		})
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
	
	close(){
		const self = this;	
		self.data.isShowStore = false;
		self.setData({
			isShowStore: self.data.isShowStore
		})
	},
	
	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll) {
			self.data.paginate.currentPage++;
			if(self.data.sForm.name==''){
				self.getMainData();
			}else{
				self.searchShop()
			}
			
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
