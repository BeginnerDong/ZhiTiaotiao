import {
	Api
} from '../../utils/api.js';
var api = new Api();

import {
	Token
} from '../../utils/token.js';
var token = new Token();

Page({

	data: {
		isFirstLoadAllStandard: ['getMainData','getAboutData'],
		QrData: [],
		is_rule: false
	},

	onLoad() {
		const self = this;
		api.commonInit(self);
		
		self.getMainData();
		self.getAboutData()
	},
	
	onShow(){
		const self = this;
		self.data.is_show = false;
		self.setData({
			is_show: self.data.is_show
		})
	},

	getMainData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getStoreToken';
		postData.searchItem = {
			user_no:wx.getStorageSync('storeInfo').user_no	
		};
		postData.getAfter = {
			shopInfo: {
				tableName: 'ShopInfo',
				middleKey: 'user_no',
				key: 'user_no',
				searchItem: {
					status: 1
				},
				condition: '='
			}
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData = res.info.data[0];
			};
			self.setData({
				web_mainData: self.data.mainData
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		};
		api.userGet(postData, callback);
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
					title: ['=', ['店铺会员规则']],
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


	getQrData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getStoreToken'
		postData.qrInfo = {
			scene: wx.getStorageSync('storeInfo').user_no,
			path: 'pages/userPayment/userPayment',
		};
		postData.output = 'url';
		postData.ext = 'png';
		const callback = (res) => {
			if (res.solely_code == 100000) {
				self.data.QrData = res;
			} else {
				api.showToast(res.msg, 'none')
			}
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getQrData', self)
			self.setData({
				web_QrData: self.data.QrData,
			});
		};
		api.getQrCode(postData, callback);
	},
	
	save() {
		let self = this
		//若二维码未加载完毕，加个动画提高用户体验
		wx.showToast({
			icon: 'loading',
			title: '正在保存图片',
			duration: 1000
		})
		//判断用户是否授权"保存到相册"
		wx.getSetting({
			success(res) {
				//没有权限，发起授权
				if (!res.authSetting['scope.writePhotosAlbum']) {
					wx.authorize({
						scope: 'scope.writePhotosAlbum',
						success() { //用户允许授权，保存图片到相册
						console.log(111)
							self.savePhoto();
						},
						fail() { //用户点击拒绝授权，跳转到设置页，引导用户授权
						console.log(222)
								self.data.is_show = true;
								self.setData({
									is_show: self.data.is_show
								})
						}
					})
				} else { //用户已授权，保存到相册
				console.log(333)
					self.savePhoto()
				}
			}
		})
	},
	//保存图片到相册，提示保存成功
	savePhoto() {
		let self = this
		wx.downloadFile({
			url: self.data.mainData.qrCode,
			success: function(res) {
				wx.saveImageToPhotosAlbum({
					filePath: res.tempFilePath,
					success(res) {
						wx.showToast({
							title: '保存成功',
							icon: "success",
							duration: 1000
						})
					}
				})
			}
		})
	},
	
	
	cancle(e) {
		const self = this;
		self.data.is_show = false;
		self.setData({
			is_show: self.data.is_show
		})
	},
	

	rule() {
		const self = this;
		self.data.is_rule = !self.data.is_rule;
		self.setData({
			is_rule: self.data.is_rule
		})
	},

	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},

})
