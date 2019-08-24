import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
	data: {
		time: 2019 - 9 - 9,
		currentId: 0,
		searchItem: {
			status:['in',[1,0,-1]],
			type:5,
		},
		mainData:[],
		isFirstLoadAllStandard:['getMainData','getUserInfoData'],
		totalCount:0,
		serviceCount:0,
		helpCount:0,
	},
	//事件处理函数
	
	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.getMainData();
		self.getUserInfoData();
		self.setData({
			web_currentId: self.data.currentId
		})
	},
	
	getUserInfoData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getAgentToken';
		postData.searchItem = {
			user_no:wx.getStorageSync('agentInfo').user_no
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
		postData.tokenFuncName = 'getAgentToken';
		postData.searchItem = api.cloneForm(self.data.searchItem);
		postData.searchItem.user_no=wx.getStorageSync('agentInfo').user_no;
		postData.order = {
			create_time: 'desc',
		};
		postData.getAfter = {
			shopInfo: {
				tableName: 'ShopInfo',
				middleKey: 'shop_no',
				key: 'user_no',
				searchItem: {
					status: 1
				},
				condition: '=',
				info: ['name']
			}
		};
		postData.compute = {
		  totalCount:[
			'sum',
			'count',
			{status:['in',[1,0,-1]],type:5,user_no:wx.getStorageSync('agentInfo').user_no,count:['>',0]}
		  ],
		  serviceCount:[
		  		'sum',
		  		'count',
		  		{status:['in',[1,0,-1]],type:5,user_no:wx.getStorageSync('agentInfo').user_no,count:['>',0],benefit_type:1}
		  ],
		  helpCount:[
		  		'sum',
		  		'count',
		  		{status:['in',[1,0,-1]],type:5,user_no:wx.getStorageSync('agentInfo').user_no,count:['>',0],benefit_type:2}
		  ],
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data);
				
			} else {
				self.data.isLoadAll = true;
				api.showToast('没有更多了', 'none');
			};
			 setTimeout(function()
			{
			  wx.hideNavigationBarLoading();
			  wx.stopPullDownRefresh();
			},300);
			self.setData({
				web_totalCount:res.info.compute.totalCount,
				web_serviceCount:res.info.compute.serviceCount,
				web_helpCount:res.info.compute.helpCount,
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

  