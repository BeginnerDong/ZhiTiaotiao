import {
	Api
} from '../../utils/api.js';
var api = new Api();
const app = getApp();

Page({
	data: {
		is_show: false,
		isFirstLoadAllStandard: ['getUserInfoData']
	},
	show(e) {
		const self = this;
		api.showToast('敬请期待', 'none', 1000)
	},
	
	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.hfInfoGet()
	
	},
	
	hfInfoGet() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getStoreToken';
	
		const callback = (res) => {
			if (res.solely_code == 100000) {
				if (res.solely_code == 100000) {
					self.data.hfInfoData  = res.info.data[0]
					self.getUserInfoData();
				};
			};
		};
		api.hfInfoGet(postData, callback);
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

	loginOff() {
		const self = this;
		wx.removeStorageSync('login');
		wx.removeStorageSync('storeToken');
		wx.removeStorageSync('storeInfo');
		api.pathTo('/pages/userStoreLogin/userStoreLogin', 'redi');
	},


	intoStatus(e) {
		const self = this;
		if (self.data.userInfoData.check_status == 2) {
			api.showToast('您已开户', 'none');

		} else if(self.data.userInfoData.check_status == 1&&self.data.hfInfoData.type==1){
			api.pathTo('/pages/userRegisterInforaa/userRegisterInforaa', 'nav');
		} else if(self.data.userInfoData.check_status == 1&&self.data.hfInfoData.type==2){
			api.pathTo('/pages/userRegisterInfor/userRegisterInfor', 'nav');
		}else{
			api.pathTo(api.getDataSet(e, 'path'), 'nav');
		}
	},

	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
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
