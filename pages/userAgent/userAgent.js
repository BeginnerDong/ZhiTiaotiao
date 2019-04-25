import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();

Page({
	data: {
	
		searchItem: {},
	
		isFirstLoadAllStandard: ['getUserInfoData']
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.getUserInfoData()

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
	
	loginOff(){
		const self = this;
		wx.removeStorageSync('login');
		wx.removeStorageSync('agentToken');
		wx.removeStorageSync('agentInfo');
		api.pathTo('/pages/userAgentLogin/userAgentLogin','redi');
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

  