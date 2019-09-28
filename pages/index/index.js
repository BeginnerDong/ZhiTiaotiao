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
		background: ['/images/banner.jpg', '/images/banner.jpg', '/images/banner.jpg'],
		indicatorDots: false,
		vertical: false,
		autoplay: true,
		circular: true,
		interval: 2000,
		duration: 500,
		previousMargin: 0,
		nextMargin: 0,
		isFirstLoadAllStandard: ['getSliderData','getLocation', 'getMessageData'],
		sliderData: [],
		newShopData: [],
		hotShopData: [],
		messageData: [],
		city: '',
		order: {},
		redDotData:[],
		isShow:false,
		timeSecret:0
	},
	//事件处理函数

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		
		self.getSliderData();		
	},
	onHide(){
		const self = this;
		self.data.hotShopData=[];
		self.data.newShopData=[];
		console.log('onHide')
	},
	
	onShow(){
		const self = this;
		self.data.timeSecret = new Date().getTime();
		console.log('onshow',(new Date().getTime()));
		self.data.is_show = false;
		self.data.hotShopData=[];
		self.data.newShopData=[];
		self.setData({
			/* web_hotShopData:self.data.hotShopData,
			web_newShopData:self.data.newShopData, */
			is_show: self.data.is_show,
		});
		const callback = (res) =>{
			self.getRedDotData();
			self.getMessageData();
			self.getLocation();
		};
		token.getProjectToken(callback,{refreshToken:true})
		
		//self.getThirdAppData()
	},
	
/* 	getThirdAppData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			
		};
		const callback = (res) => {
			console.log(1000, res);
			if (res.info.data.length > 0) {
				self.data.thirdAppData = res.info.data[0]			
			};
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'thirdAppGet', self);
		};
		api.thirdAppGet(postData, callback);
	}, */
	

	
	getCityData() {
		const self = this;
		const postData = {};
		postData.timeSecret = self.data.timeSecret;
		postData.searchItem = {
			thirdapp_id: getApp().globalData.thirdapp_id,
			title:self.data.city
		};
		const callback = (res) => {
			console.log('1000', self.data.timeSecret);
			
			if (res.info.data.length > 0) {
				self.data.cityData = res.info.data[0]			
			};
			self.data.city_id = self.data.cityData&&self.data.cityData.id?self.data.cityData.id:wx.getStorageSync('info').thirdApp.view_count;	
			self.setData({
				web_city: self.data.cityData&&self.data.cityData.title?self.data.cityData.title:wx.getStorageSync('info').thirdApp.codeName
			});
			self.getHotShopData();
			self.getNewShopData();	
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getCityData', self);
		};
		api.labelGet(postData, callback);
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
					title: ['=', ['首页轮播图']],
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
			user_type: 1,
			status: 1,
			is_show:1
		};
		postData.order = {
			create_time: 'desc'
		};
		postData.getBefore = {
			city: {
				tableName: 'UserInfo',
				searchItem: {
					city_id: ['in',[self.data.city_id]],
				},
				middleKey: 'user_no',
				key: 'user_no',
				condition: 'in',
			},
		};
		/* postData.order[orderKey]= orderKey; */
		const callback = (res) => {

			if (res.info.data.length > 0) {
				self.data.newShopData.push.apply(self.data.newShopData, res.info.data)
				
			}else{
				self.data.city_id = wx.getStorageSync('info').thirdApp.view_count;
				
				self.setData({
					web_city: wx.getStorageSync('info').thirdApp.codeName
				});
				self.getNewShopTwoData()
			}
			self.setData({
				web_newShopData: self.data.newShopData
			});
			
		};
		api.shopInfoGet(postData, callback);
	},
	
	getNewShopTwoData() {
		const self = this;
	
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			user_type: 1,
			status: 1,
			is_show:1
		};
		postData.order = {
			create_time: 'desc'
		};
		postData.getBefore = {
			city: {
				tableName: 'UserInfo',
				searchItem: {
					city_id: ['in',[self.data.city_id]],
				},
				middleKey: 'user_no',
				key: 'user_no',
				condition: 'in',
			},
		};
		/* postData.order[orderKey]= orderKey; */
		const callback = (res) => {
	
			if (res.info.data.length > 0) {
				self.data.newShopData.push.apply(self.data.newShopData, res.info.data)
				
			}else{
				api.showToast('城市暂未开通','none')
			}
			self.setData({
				web_newShopData: self.data.newShopData
			});
			
		};
		api.shopInfoGet(postData, callback);
	},

	getHotShopData() {
		const self = this;
		var orderKey = 'view_count * 0.0002 + favor_count * 0.4999 + follow_count * 0.4999';
		self.data.order[orderKey] = 'desc';
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			user_type: 1,
			status: 1,
			is_show:1
		};
		postData.order = api.cloneForm(self.data.order);
		postData.getBefore = {
			city: {
				tableName: 'UserInfo',
				searchItem: {
					city_id: ['in',[self.data.city_id]],
				},
				middleKey: 'user_no',
				key: 'user_no',
				condition: 'in',
			},
		};
		/* postData.order[orderKey]= orderKey; */
		const callback = (res) => {

			if (res.info.data.length > 0) {
				self.data.hotShopData.push.apply(self.data.hotShopData, res.info.data)
				
			}else{
				self.data.city_id = wx.getStorageSync('info').thirdApp.view_count;
				
				self.setData({
					web_city: wx.getStorageSync('info').thirdApp.codeName
				});
				self.getHotShopTwoData()
			}
			self.setData({
				web_hotShopData: self.data.hotShopData
			});
			
		};
		api.shopInfoGet(postData, callback);
	},
	
	getHotShopTwoData() {
		const self = this;
		var orderKey = 'view_count * 0.0002 + favor_count * 0.4999 + follow_count * 0.4999';
		self.data.order[orderKey] = 'desc';
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			user_type: 1,
			status: 1,
			is_show:1
		};
		postData.order = api.cloneForm(self.data.order);
		postData.getBefore = {
			city: {
				tableName: 'UserInfo',
				searchItem: {
					city_id: ['in',[self.data.city_id]],
				},
				middleKey: 'user_no',
				key: 'user_no',
				condition: 'in',
			},
		};
		/* postData.order[orderKey]= orderKey; */
		const callback = (res) => {
	
			if (res.info.data.length > 0) {
				self.data.hotShopData.push.apply(self.data.hotShopData, res.info.data)
				
			}else{
				api.showToast('城市暂未开通','none')
			}
			self.setData({
				web_hotShopData: self.data.hotShopData
			});
			
		};
		api.shopInfoGet(postData, callback);
	},
	

	getRedDotData() {
		const self = this;
		var num = false;
		self.data.redDotData = [];
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {};
		postData.searchItem.user_no = ['in', [wx.getStorageSync('info').user_no, 'U910872296194660']];
		postData.searchItem.type = ['in', [1, 2, 3, 4, 5]];
		postData.getAfter = {
			log: {
				tableName: 'Log',
				middleKey: 'id',
				key: 'relation_id',
				searchItem: {
					status: 1,
					type: 6
				},
				condition: '=',
			}
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.redDotData.push.apply(self.data.redDotData, res.info.data);
				
				for (var i = 0; i < self.data.redDotData.length; i++) {
					if(self.data.redDotData[i].log.length==0){
						num = true
					}
				}
			};
			console.log(num)
			self.setData({
				web_num:num,
				web_redDotData: self.data.redDotData
			});
		};
		api.messageGet(postData, callback);
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
		postData.paginate={
			count: 0,
			currentPage: 1,
			is_page: true,
			pagesize: 2,
		};
		
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.messageData.push.apply(self.data.messageData, res.info.data);
				/* for (var i = 0; i < self.data.messageData.length; i++) {
					self.data.messageData[i].content = api.wxParseReturn(res.info.data[i].content).nodes;
				} */
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
				if(res.authSetting){
					self.data.is_show=true;
					self.setData({
						is_show:self.data.is_show
					})
					return
				}
				
				self.data.city = res.address_component.city
				self.getCityData();
			};
			self.setData({
				web_city: self.data.city
			})
		};
		api.getLocation('reverseGeocoder', callback);
		api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getLocation', self)
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


	intoPathRedirect(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'redi');
	},

})
