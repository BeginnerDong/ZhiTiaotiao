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
		self.data.user_no = options.user_no;
		self.getMainData();

		console.log('self.data.user_no', self.data.user_no)
	},
	
	rewardParamGet() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			use:1
		}
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
		if (!wx.getStorageSync('info') || !wx.getStorageSync('info').headImgUrl) {
			postData.refreshToken = true;
		};
		postData.data = {
			shop_no: self.data.user_no,
			price: self.data.submitData.money
		}
		if (JSON.stringify(postData.pay) == '{}') {
			api.buttonCanClick(self, true);
			api.showToast('空白充值', 'error');
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
								self.data.is_peice = true;
								self.setData({
									is_peice:self.data.is_peice
								})
							});
							
						} else {
							api.showToast('调起微信支付失败', 'none');
						};

						self.data.submitData.money = '';
						self.data.is_show = false;
						self.setData({
							is_show: self.data.is_show
						})
					};
					api.realPay(res.info, payCallback);
				} else {
					console.log(777)
				};
			} else {
				
				if(res.msg=='积分不足'){
					api.showToast('知条不足', 'none');
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
			
			
				self.pay()
			
			
		} else {
			api.buttonCanClick(self, true);
			if (self.data.currentId == 0) {
				api.showToast('请输入支付金额', 'none')
			} else if (self.data.currentId == 1) {
				api.showToast('请输入支条数量', 'none')
			}
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
		console.log(self.data.currentId)
		var currentId = api.getDataSet(e,'id');
		if(self.data.currentId!=currentId){
			self.data.currentId = currentId
			self.setData({
				currentId: self.data.currentId
			})
		}
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

	intoPathRedirect(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'redi');
	},

	/* 	getCityStoreData() {
			const self = this;
			const postData = {};
			postData.tokenFuncName = 'getProjectToken';
			postData.searchItem = {
				province:self.data.mainData.store.province,
				city:self.data.mainData.store.city,
				user_type:2
			};
			const callback = (res) => {
				if (res.info.data.length > 0) {
					self.data.cityStoreData = res.info.data;
				};
				console.log('self.data.cityStoreData',self.data.cityStoreData)
				api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getCityStoreData', self);
			};
			api.userInfoGet(postData, callback);
		},
		
		distributionGet() {
			const self = this;
			const postData = {};
			postData.tokenFuncName = 'getProjectToken';
			postData.searchItem = {
				child_no: wx.getStorageSync('info').user_no,
			};
			const callback = (res) => {
				if (res.solely_code == 100000) {
					self.data.distributionData = res.info.data
				};
				
				api.checkLoadAll(self.data.isFirstLoadAllStandard, 'distributionGet', self);
			};
			api.distributionGet(postData, callback);
		},

		distributionTwoGet() {
			const self = this;
			const postData = {};
			postData.tokenFuncName = 'getProjectToken';
			postData.searchItem = {
				child_no: self.data.user_no,
				type:1
			};
			const callback = (res) => {
				if (res.solely_code == 100000) {
					self.data.distributionTwoData.push.apply(self.data.distributionTwoData,res.info.data)
				};
				api.checkLoadAll(self.data.isFirstLoadAllStandard, 'distributionTwoGet', self);
			};
			api.distributionGet(postData, callback);
		}, */


	/* 	flowLogAdd() {
			const self = this;
			console.log(parseFloat(self.data.mainData.score))
			console.log(self.data.submitData.money)
			if (parseFloat(self.data.mainData.score) < self.data.submitData.money) {
				api.buttonCanClick(self, true)
				api.showToast('支条不足', 'none');
				return
			};
			const postData = {};
			postData.tokenFuncName = 'getProjectToken';
			postData.data = {
				count: -self.data.submitData.money,
				type: 3,
				shop_no: self.data.user_no,
				user_no: wx.getStorageSync('info').user_no,
				thirdapp_id: 2,
				behavior:2
			};
			postData.saveAfter = [{
				tableName: 'FlowLog',
				FuncName: 'add',
				data: {
					count: self.data.submitData.money,
					type: 3,
					consumer_no: wx.getStorageSync('info').user_no,
					user_no: self.data.user_no,
					thirdapp_id: 2,
					behavior:2
				}
			}];
			if (self.data.distributionData.length == 0) {
				postData.saveAfter.push({
					tableName: 'Distribution',
					FuncName: 'add',
					data: {
						parent_no: self.data.user_no,
						child_no: wx.getStorageSync('info').user_no,
						level: 1,
						thirdapp_id: 2,
						type: 2
					}
				}, 
				{
					tableName: 'UserInfo',
					FuncName: 'update',
					searchItem: {
						user_no: self.data.user_no
					},
					data: {
						mem_num: self.data.mainData.store.mem_num + 1
					}
				})
			};
			console.log('postData', postData)
			const callback = (res) => {
				api.buttonCanClick(self, true);
				if (res.solely_code == 100000) {
					api.showToast('支付成功', 'none');
					self.data.is_peice = true;
					self.data.is_show = false;
					self.setData({
						is_show: self.data.is_show
					})
				} else {
					api.showToast(res.msg, 'none')
				}
			}
			api.flowLogAdd(postData, callback)
		},
		
		

		realPay() {
			const self = this;
			const postData = {};
			var ratio = self.data.mainData.store.ratio;
			console.log('给店铺的货款',self.data.submitData.money-(self.data.submitData.money*ratio/100));
			console.log('给平台的服务费',(self.data.submitData.money*ratio/100)*0.06);
			console.log('给用户的月奖支条',(self.data.submitData.money*ratio/100)*0.04);
			console.log('给用户的支条',(self.data.submitData.money*ratio/100)*0.35);

			postData.tokenFuncName = 'getProjectToken';
			postData.data = {
				count: self.data.submitData.money,
				type: 1,
				shop_no: self.data.user_no,
				user_no: wx.getStorageSync('info').user_no,
				thirdapp_id: 2
			};
			postData.saveAfter = [
			{
				tableName: 'FlowLog',
				FuncName: 'add',
				data: {
					count: self.data.submitData.money-(self.data.submitData.money*ratio/100),
					type: 2,
					consumer_no: wx.getStorageSync('info').user_no,
					user_no: self.data.user_no,
					thirdapp_id: 2,
					behavior:2
				}
			},
			{
				tableName: 'FlowLog',
				FuncName: 'add',
				data: {
					count: (self.data.submitData.money*ratio/100)*0.06,
					type: 5,
					consumer_no: wx.getStorageSync('info').user_no,
					user_no: 'U910872296194660',
					thirdapp_id: 2,
					behavior:2
				}
			},
			{
				tableName: 'FlowLog',
				FuncName: 'add',
				data: {
					count: (self.data.submitData.money*ratio/100)*0.04,
					type: 3,
					consumer_no: wx.getStorageSync('info').user_no,
					user_no: wx.getStorageSync('info').user_no,
					thirdapp_id: 2,
					behavior:1
				}
			},		
			{
				tableName: 'FlowLog',
				FuncName: 'add',
				data: {
					count: (self.data.submitData.money*ratio/100)*0.35,
					type: 3,
					consumer_no: wx.getStorageSync('info').user_no,
					user_no: wx.getStorageSync('info').user_no,
					thirdapp_id: 2,
					behavior:2
				}
			}
			];
			if (self.data.distributionData.length == 0) {
				postData.saveAfter.push({
					tableName: 'Distribution',
					FuncName: 'add',
					data: {
						parent_no: self.data.user_no,
						child_no: wx.getStorageSync('info').user_no,
						level: 1,
						thirdapp_id: 2,
						type: 2
					}
				}, 
				{
					tableName: 'UserInfo',
					FuncName: 'update',
					searchItem: {
						user_no: self.data.user_no
					},
					data: {
						mem_num: self.data.mainData.store.mem_num + 1
					}
				},
				{
					tableName: 'FlowLog',
					FuncName: 'add',
					data: {
						count: (self.data.submitData.money*ratio/100)* 0.5,
						type: 4,
						consumer_no: wx.getStorageSync('info').user_no,
						user_no: self.data.user_no,
						thirdapp_id: 2,
						behavior:1
					}
				}
				)
			} else {
				postData.saveAfter.push({
					tableName: 'FlowLog',
					FuncName: 'add',
					data: {
						count: (self.data.submitData.money*ratio/100)* 0.5,
						type: 4,
						consumer_no: wx.getStorageSync('info').user_no,
						user_no: self.data.distributionData[0].parent_no,
						thirdapp_id: 2,
						behavior:1
					}
				})
			};
			if(self.data.distributionTwoData.length==2){
				for (var i = 0; i < self.data.distributionTwoData.length; i++) {
					if(self.data.distributionTwoData[i].level=1){
						postData.saveAfter.push({
							tableName: 'FlowLog',
							FuncName: 'add',
							data: {
								count: (self.data.submitData.money*ratio/100)*0.03,
								type: 5,
								consumer_no: self.data.user_no,
								user_no: self.data.distributionData[i].parent_no,
								thirdapp_id: 2,
								behavior:2,
								trade_info:'服务佣金'
							}
						})
					}else if(self.data.distributionTwoData[i].level=2){
						postData.saveAfter.push({
							tableName: 'FlowLog',
							FuncName: 'add',
							data: {
								count: (self.data.submitData.money*ratio/100)*0.01,
								type: 5,
								consumer_no: self.data.user_no,
								user_no: self.data.distributionData[i].parent_no,
								thirdapp_id: 2,
								behavior:2,
								trade_info:'辅导佣金'
							}
						})
					}
				}
			}else if(self.data.distributionTwoData.length==1){
				postData.saveAfter.push(
				{
					tableName: 'FlowLog',
					FuncName: 'add',
					data: {
						count: (self.data.submitData.money*ratio/100)*0.03,
						type: 5,
						consumer_no: wx.getStorageSync('info').user_no,
						user_no: self.data.distributionData[0].parent_no,
						thirdapp_id: 2,
						behavior:2,
						trade_info:'服务佣金'
					}
				},
				{
					tableName: 'FlowLog',
					FuncName: 'add',
					data: {
						count: (self.data.submitData.money*ratio/100)*0.01,
						type: 5,
						consumer_no: wx.getStorageSync('info').user_no,
						user_no: 'U910872296194660',
						thirdapp_id: 2,
						behavior:2
					}
				}
				)
			};
			if(self.data.cityStoreData.length>0){
				postData.saveAfter.push(
				{
					tableName: 'FlowLog',
					FuncName: 'add',
					data: {
						count: (self.data.submitData.money*ratio/100)*0.01,
						type: 5,
						consumer_no: wx.getStorageSync('info').user_no,
						user_no: self.data.cityStoreData[0].user_no,
						thirdapp_id: 2,
						behavior:2
					}
				},
				)
			}else{
				postData.saveAfter.push(
			
				{
					tableName: 'FlowLog',
					FuncName: 'add',
					data: {
						count: (self.data.submitData.money*ratio/100)*0.01,
						type: 5,
						consumer_no: wx.getStorageSync('info').user_no,
						user_no: 'U910872296194660',
						thirdapp_id: 2,
						behavior:2
					}
				}
				)
			}
			console.log('postData', postData)
			const callback = (res) => {
				api.buttonCanClick(self, true);
				if (res.solely_code == 100000) {
					api.showToast('支付成功', 'none');
					self.data.is_peice = true;
					self.data.is_show = false;
					self.setData({
						is_show: self.data.is_show
					})
				} else {
					api.showToast(res.msg, 'none')
				}
			}
			api.flowLogAdd(postData, callback)
		}, */



})
