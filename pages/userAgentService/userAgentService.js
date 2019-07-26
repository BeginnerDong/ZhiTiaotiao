/* import {
	Api
} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {
	Token
} from '../../utils/token.js';
const token = new Token();

Page({
	data: {
		userNoArray: [],
		mainData: [],
		originData: [],
		isFirstLoadAllStandard: ['getMainData', 'getTopData'],
		topData: []
	},
	//事件处理函数


	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.getMainData();
		self.getTopData()
	},

	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self)
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.tokenFuncName = 'getAgentToken';
		postData.searchItem = {
			parent_no: wx.getStorageSync('agentInfo').user_no,
			type: 1,
			level: 2,
		};
		postData.getAfter = {
			shopInfo: {
				tableName: 'ShopInfo',
				middleKey: 'child_no',
				key: 'user_no',
				searchItem: {
					status: 1
				},
				condition: '='
			}
		};
		postData.order = {
			create_time: 'desc'
		}
		const callback = (res) => {
			if (res.solely_code == 100000) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data);
			} else {
				self.data.isLoadAll = true;
			}
			self.setData({
				web_mainData: self.data.mainData
			})
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		};
		api.distributionGet(postData, callback);
	},

	getTopData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getAgentToken';
		postData.searchItem = {
			parent_no: wx.getStorageSync('agentInfo').user_no,
			type: 3,
			level: 1,
		};
		postData.getAfter = {
			shopNum: {
				tableName: 'UserInfo',
				middleKey: 'child_no',
				key: 'user_no',
				searchItem: {
					status: 1
				},
				condition: '=',
				compute: {
					num: ['sum', 'shop_num', {
						status: 1
					}]
				}
			},
			authNum: {
				tableName: 'UserInfo',
				middleKey: 'child_no',
				key: 'user_no',
				searchItem: {
					status: 1
				},
				condition: '=',
				compute: {
					num: ['sum', 'auth_num', {
						status: 1
					}]
				}
			},
			me:{
				tableName: 'UserInfo',
				middleKey: 'parent_no',
				key: 'user_no',
				searchItem: {
					status: 1
				},
				condition: '=',
			}
		};
		const callback = (res) => {
			if (res.solely_code == 100000) {
				self.data.topData.push.apply(self.data.topData, res.info.data);
				self.data.shopCount = 0;
				self.data.authCount = 0;
				for (var i = 0; i < self.data.topData.length; i++) {
					self.data.shopCount += self.data.topData[i].shopNum.num
					self.data.authCount += self.data.topData[i].authNum.num
				}
				console.log('self.data.topData[i].shopNum.num', self.data.topData[0].shopNum.num)
			}
			self.setData({
				web_shopCount: self.data.shopCount,
				web_authCount: self.data.authCount,
				web_topData: self.data.topData
			})
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getTopData', self);
		};
		api.distributionGet(postData, callback);
	},

	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll) {
			self.data.paginate.currentPage++;
			self.getMainData();
		};
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

}) */
import {Api} from '../../utils/api.js';
var api = new Api();

import {Token} from '../../utils/token.js';
var token = new Token();

Page({

	data: {
		is_edit: true,
		submitData: {
			name:'',
			phone:'',
			email:'',
			user_no:'',
			bill_img:[],
			address:''
		},
		isFirstLoadAllStandard: ['getMainData']
	},

	onLoad() {
		const self = this;
		api.commonInit(self);
		self.getMainData()
	},


	onShow() {
		const self = this;

	},

	getMainData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getAgentToken';
		postData.searchItem = {
			user_no:wx.getStorageSync('agentInfo').user_no
		};
		const callback = (res) => {
			self.data.mainData = {};
			if (res.info.data.length > 0) {
				self.data.mainData = res.info.data[0];
				self.data.submitData.phone = res.info.data[0].phone;
				self.data.submitData.name = res.info.data[0].name;
				self.data.submitData.email = res.info.data[0].email;
				self.data.submitData.bill_img = res.info.data[0].bill_img;
				self.data.submitData.address = res.info.data[0].address;
				self.data.submitData.user_no = res.info.data[0].user_no;
			};
			self.setData({
				web_submitData: self.data.submitData,
				web_mainData: self.data.mainData
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		};
		api.userInfoGet(postData, callback);
	},

	userInfoUpdate() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getAgentToken';
		postData.searchItem = {
			user_no:wx.getStorageSync('agentInfo').user_no
		};
		postData.data = {};
		postData.data = api.cloneForm(self.data.submitData);
		const callback = (data) => {
			if (data.solely_code == 100000) {
				api.buttonCanClick(self, true);
				api.showToast('上传成功', 'none')
				setTimeout(function() {
					wx.navigateBack({
						delta: 1
					});
				}, 300);
			} else {
				api.showToast('网络故障', 'none')
			};

		};
		api.userInfoUpdate(postData, callback);
	},

	upLoadBillImg() {
		const self = this;
	
		wx.showLoading({
			mask: true,
			title: '图片上传中',
		});
		const callback = (res) => {
			console.log('res', res)
			if (res.solely_code == 100000) {
				console.log('self.data.submitData.bill_img',self.data.submitData.bill_img)
				self.data.submitData.bill_img.push({
					url: res.info.url
				})
				self.setData({
					web_submitData: self.data.submitData
				});
				wx.hideLoading()
				console.log('self.data.submitData', self.data.submitData)
			} else {
				api.showToast('网络故障', 'none')
			}
		};

		wx.chooseImage({
			count: 1,
			success: function(res) {
				console.log(res);
				var tempFilePaths = res.tempFilePaths;
				console.log(callback)
				api.uploadFile(tempFilePaths[0], 'file', {
					tokenFuncName: 'getAgentToken',
					type:'image'
				}, callback)
			},
			fail: function(err) {
				wx.hideLoading();
			}
		})
	},

	

	submit() {
		const self = this;
		api.buttonCanClick(self);
		var phone = self.data.submitData.phone;
		var newObject = api.cloneForm(self.data.submitData);

		delete newObject.bill_img;
		console.log('newObject', newObject)
		const pass = api.checkComplete(newObject);
		console.log('pass', pass)
		if (pass) {
			if (phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {
				api.buttonCanClick(self, true);
				api.showToast('手机格式错误', 'none')
			} else {
				self.userInfoUpdate();
			}
		} else {
			api.buttonCanClick(self, true);
			api.showToast('请补全信息', 'none');
		};
	},
	
	deleteImg(e){
		const self = this;
		var index = api.getDataSet(e,'index');
		var type = api.getDataSet(e,'type');
		if(type=='mainImg'){
			self.data.submitData.mainImg.splice(index,1);
		}else if(type=='bannerImg'){
			self.data.submitData.bannerImg.splice(index,1);
		};
		console.log(self.data.submitData);
		self.setData({
			web_submitData:self.data.submitData
		})
	},

	edit() {
		const self = this;
		self.data.is_edit = !self.data.is_edit
		self.setData({
			is_edit: self.data.is_edit
		})
	},

	changeBind(e) {
		const self = this;
		api.fillChange(e, self, 'submitData');
		self.setData({
			web_submitData: self.data.submitData,
		});
	},
	
  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },
  
})

  
