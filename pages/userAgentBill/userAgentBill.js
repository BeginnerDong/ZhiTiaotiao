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
			behavior:2,
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
		postData.searchItem = {
			user_no:wx.getStorageSync('agentInfo').user_no
		}
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
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data);
				for (var i = 0; i < self.data.mainData.length; i++) {
					if(self.data.mainData[i].count>0){
						self.data.totalCount +=parseFloat(self.data.mainData[i].count)
					};
					if(self.data.mainData[i].count>0&&self.data.mainData[i].benefit_type ==1){
						self.data.serviceCount +=parseFloat(self.data.mainData[i].count)
					};
					if(self.data.mainData[i].count>0&&self.data.mainData[i].benefit_type ==2){
						self.data.helpCount +=parseFloat(self.data.mainData[i].count)
					};
				}
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
				web_totalCount:self.data.totalCount.toFixed(2),
				web_serviceCount:self.data.serviceCount.toFixed(2),
				web_helpCount:self.data.helpCount.toFixed(2),
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

  