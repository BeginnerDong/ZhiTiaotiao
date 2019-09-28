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
	
	onShow(){
		const self = this;
		self.getRedDotData()
	},
	
	getRedDotData() {
		const self = this;
		var num = false;
		self.data.redDotData = [];
		const postData = {};
		postData.tokenFuncName = 'getStoreToken';
		postData.searchItem = {};
		postData.searchItem.user_no = ['in', [wx.getStorageSync('storeInfo').user_no]];
		postData.searchItem.type = ['in', [7]];
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
		api.userGet(postData, callback);
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
		if (self.data.userInfoData.info.check_status == 2) {
			api.showToast('您已开户', 'none');

		} else if((self.data.userInfoData.info.check_status == 1||self.data.userInfoData.info.check_status == 4)&&self.data.hfInfoData.type==1){
			api.pathTo('/pages/userRegisterInforbb/userRegisterInforbb', 'nav');
		} else if((self.data.userInfoData.info.check_status == 1||self.data.userInfoData.info.check_status == 4)&&self.data.hfInfoData.type==2){
			api.pathTo('/pages/userRegisterInforb/userRegisterInforb', 'nav');
		}else if(self.data.userInfoData.info.check_status == 3&&self.data.hfInfoData.type==2){
			api.pathTo('/pages/userRegisterInfor/userRegisterInfor', 'nav');
		}else if(self.data.userInfoData.info.check_status == 3&&self.data.hfInfoData.type==1){
			api.pathTo('/pages/userRegisterInforaa/userRegisterInforaa', 'nav');
		}else{
			api.pathTo(api.getDataSet(e, 'path'), 'nav');
		}
	},
	
	intoQr(e) {
		const self = this;
		if (self.data.userInfoData.qrCode == '') {
			api.showToast('收款码暂未生成', 'none')
			
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
