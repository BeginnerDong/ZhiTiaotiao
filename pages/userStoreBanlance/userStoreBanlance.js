import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
	data: {
		is_rule:false,
		currentId: 1,
		searchItem: {
			status:['in',[1,0,-1]],
			type:2,
			count:['>',0]
		},
		mainData:[],
		isFirstLoadAllStandard:['getMainData','getUserInfoData','getAboutData','getTodayData'],
	},
	//事件处理函数
	
	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.getMainData();
		self.getUserInfoData();
		self.getAboutData();
		self.getTodayData();
		self.setData({
			web_currentId: self.data.currentId
		})
	},
	
	getTodayData() {
		const self = this;
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.tokenFuncName = 'getStoreToken';
		postData.searchItem = api.cloneForm(self.data.searchItem);
		postData.searchItem.user_no=wx.getStorageSync('storeInfo').user_no;
		postData.searchItem.create_time = ['between',[new Date(new Date().toLocaleDateString()).getTime()/1000,
		new Date(new Date().toLocaleDateString()).getTime() +24 * 60 * 60  -1]]
		postData.order = {
			create_time: 'desc',
		};
		postData.compute = {
		  totalCount:[
			'sum',
			'count',
			api.cloneForm(self.data.searchItem)
		  ],  
		};
		postData.compute.totalCount[2].user_no = wx.getStorageSync('storeInfo').user_no;
		postData.compute.totalCount[2].create_time = ['between',[new Date(new Date().toLocaleDateString()).getTime()/1000,
		new Date(new Date().toLocaleDateString()).getTime() +24 * 60 * 60  -1]]
		const callback = (res) => {
			if(res.solely_code==100000){
				self.data.todayItem = res.info.total;
				self.data.todayMoney = res.info.compute.totalCount
			}
			self.setData({
				web_todayItem:self.data.todayItem,
				web_todayMoney:self.data.todayMoney
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getTodayData', self)
		};
		api.flowLogGet(postData, callback);
	},
	
	changeType(e){
		const self = this;
		
		self.data.mainData = [];
		self.setData({
			web_mainData:self.data.mainData
		});
		var currentId = api.getDataSet(e,'id');
		if(self.data.currentId!=currentId){
			api.buttonCanClick(self);
			self.data.currentId = currentId;
			if(currentId==1){
				self.data.searchItem.type=2;
				self.data.searchItem.count=['>',0],
				delete self.data.searchItem.behavior
			}else if(currentId==2){
				
				self.data.searchItem.type=4;
				self.data.searchItem.behavior  =2
			};
			self.getMainData(true)
		};
		
		self.setData({
			web_currentId:self.data.currentId
		})
	},
	
	getUserInfoData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getStoreToken';
		postData.searchItem = {
			user_no:wx.getStorageSync('storeInfo').user_no
		};
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
		postData.searchItem = api.cloneForm(self.data.searchItem);
		postData.searchItem.user_no=wx.getStorageSync('storeInfo').user_no;
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
			api.buttonCanClick(self,true);
			if (res.info.data.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data);
				if(self.data.currentId==2){
					for (var i = 0; i < self.data.mainData.length; i++) {
						self.data.mainData[i].create_time = self.data.mainData[i].create_time.substring(0,10)
					}
				}
			} else {
				self.data.isLoadAll = true;
			};
			 setTimeout(function()
			{
			  wx.hideNavigationBarLoading();
			  wx.stopPullDownRefresh();
			},300);
			self.setData({
				web_mainData: self.data.mainData,
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self)
		};
		api.flowLogGet(postData, callback);
	},
	
	getAboutData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			thirdapp_id: 2,
		};
		postData.getBefore = {
			label: {
				tableName: 'Label',
				searchItem: {
					title: ['=', ['联盟金结算规则']],
				},
				middleKey: 'menu_id',
				key: 'id',
				condition: 'in'
			},
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.aboutData = res.info.data[0];
				self.data.aboutData.content = api.wxParseReturn(res.info.data[0].content).nodes;
			}
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getAboutData', self);
			self.setData({
				web_aboutData: self.data.aboutData,
			});
		};
		api.articleGet(postData, callback);
	},
	
	
	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll) {
			self.data.paginate.currentPage++;
			self.getMainData();
		};
	},

	
	rule(){
		const self = this;
		self.data.is_rule = !self.data.is_rule;
		self.setData({
			is_rule:self.data.is_rule
		})
	},
	
	
	
  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  intoPathRedi(e){
    const self = this;
    wx.navigateBack({
      delta:1
    })
  },
  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 
 
})

  