//logs.js
import {
	Api
} from '../../utils/api.js';
var api = new Api();

import {
	Token
} from '../../utils/token.js';
const token = new Token();

Page({
	data: {
		currentId: 0,
		is_show: false,
		is_peice: false,
		submitData: {
			money: ''
		},
		pay:{},
		distributionData: [],
		distributionTwoData: [],
		cityStoreData: [],
		isFirstLoadAllStandard: ['getMainData']
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		var scene = decodeURIComponent(options.scene);
		console.log('scene',scene)
		self.data.user_no = scene;
		self.getMainData();
		
		console.log('self.data.user_no', self.data.user_no)
	},
	
	rewardParamGet() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			use:1
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.rewardData = res.info.data[0];
			};
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		};
		api.rewardParamGet(postData, callback);
	},
	
	getShopData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			user_no:self.data.user_no
		}
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.shopData = res.info.data[0];
			};
			self.rewardParamGet()
		};
		api.userInfoGet(postData, callback);
	},

	getMainData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData = res.info.data[0];
			};
			self.getShopData()
		
		};
		api.userInfoGet(postData, callback);
	},

	countPrice() {
		const self = this;
		var wxPay = self.data.submitData.money;
		console.log('wxPay', wxPay);
		if (self.data.currentId == 0) {
			if (wxPay > 0) {
				self.data.pay.wxPay = {
					price: wxPay
				};
				self.data.pay.wxPayStatus = 0
			}
			self.data.ztt = self.data.pay.wxPay.price*(self.data.shopData.ratio/100)*(parseInt(self.data.rewardData.ztt_reward)/100) //让利钱
			console.log('self.data.ztt',self.data.ztt)
			self.setData({
				web_ztt:self.data.ztt.toFixed(2)
			})
		}else{
			if (wxPay > 0) {
				self.data.pay.score = wxPay
			}
		}
	},

	pay() {
		const self = this;
		api.buttonCanClick(self);
		
		const postData = {};
		postData.pay = self.data.pay;
		postData.tokenFuncName = 'getProjectToken';
		if (self.data.currentId==1&&(!wx.getStorageSync('info') || wx.getStorageSync('info').headImgUrl=='')) {
			postData.refreshToken = true;
		};
		postData.data = {
			shop_no: self.data.user_no,
			price: self.data.submitData.money
		};
		if (JSON.stringify(postData.pay) == '{}') {
			api.buttonCanClick(self, true);
			api.showToast('未知错误请重试', 'none');
			return;
		};	
		const callback = (res) => {
			console.log(res)
			api.buttonCanClick(self, true)
			if (res.solely_code == 100000) {
				if (res.info) {
					const payCallback = (payData) => {
						if (payData == 1) {
							api.showToast('支付成功', 'none', 1000, function() {
								if(!self.data.pay.wxPay.price<10){
									self.data.is_peice = true;
									self.setData({
										is_peice:self.data.is_peice
									})
								}else{
									api.pathTo('/pages/index/index', 'tab');
								}
								
							});
							
						} else {
							api.showToast('支付失败', 'none');
						};
						self.data.submitData.money = '';
						self.data.is_show = false;
						self.setData({
							is_show: self.data.is_show
						})
					};
					api.realPay(res.info, payCallback);
				} else {
					api.showToast('支付成功', 'none', 1000, function() {
						api.pathTo('/pages/index/index', 'tab');			
					});
						
					
				};
			} else {
				
				if(res.msg=='积分不足'){
					api.showToast('知条数量不足', 'none');
				}else{
					api.showToast(res.msg, 'none');
				}
				
				
				self.data.submitData.money = '';
				self.data.is_show = false;
				self.setData({
					is_show: self.data.is_show
				})
			};
			self.setData({
				web_submitData: self.data.submitData
			})
		}
		api.addVirtualOrder(postData, callback);
	},

	submit() {
		const self = this;
		api.buttonCanClick(self);
		const pass = api.checkComplete(self.data.submitData);
		console.log('pass', pass)
		if (pass) {
			api.buttonCanClick(self, true);
			if(self.data.currentId==1){
				const callback = (user, res) => {
					self.pay()
				};
				api.getAuthSetting(callback);
			}else{
				self.pay()
			}		
		} else {
			console.log(222)
			api.buttonCanClick(self, true);
			if (self.data.currentId == 0) {
				api.showToast('请输入支付金额', 'none')
			
			} else if (self.data.currentId == 1) {
				api.showToast('请输入支条数量', 'none')
			
			};
			self.data.is_show = false;
			self.setData({
				is_show: self.data.is_show
			})
		};
	},

	changeBind(e) {
		const self = this;
		api.fillChange(e, self, 'submitData');
		self.setData({
			web_submitData: self.data.submitData,
		});
		self.countPrice()
	},

	payment(e) {
		const self = this;
		self.data.is_show = true;
		self.setData({
			is_show: self.data.is_show
		})
	},



	cancle(e) {
		const self = this;
		self.data.is_show = false;
		self.setData({
			is_show: self.data.is_show
		})
	},



	close(e) {
		const self = this;
		self.data.is_peice = false;
		self.data.is_show = false;
		self.setData({
			is_show: self.data.is_show,
			is_peice: self.data.is_peice,
		})
	},


	choose_payment(e) {
		const self = this;
		self.data.pay={};
		/* console.log(self.data.currentId)
		var currentId = api.getDataSet(e,'id'); */
		if(self.data.currentId==0){
			self.data.currentId = 1
		}else{
			self.data.currentId = 0	
		}
		self.setData({
			currentId: self.data.currentId
		})
	},

	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},

	intoPathBack(e) {
		const self = this;
		wx.navigateBack({
			delta: 1
		})
	},
	
	intoSwitch(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'tab');
	},

	intoPathRedirect(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'redi');
	},





})
