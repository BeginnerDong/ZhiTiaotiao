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
			count:['<',0]
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
		//self.getAboutData();
		
		self.setData({
			web_currentId: self.data.currentId
		})
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
				//self.data.searchItem.count=['>',0],
				delete self.data.searchItem.behavior
			}else if(currentId==2){
				
				self.data.searchItem.type=4;
				self.data.searchItem.behavior =2
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

  