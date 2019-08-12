import {
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
		topData: [],
		submitData:{
			user_no:''
		},
		searchItem:{
			
			type: 1,
			level: 2,
		},
		searchItemTwo:{
			
			type: 3,
			level: 1,
		}
	},
	//事件处理函数


	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.data.searchItem.parent_no=wx.getStorageSync('agentInfo').user_no;
		self.data.searchItemTwo.parent_no=wx.getStorageSync('agentInfo').user_no;
		self.getMainData();
		self.getTopData()
	},
	
	search(){
		const self = this;
		if(self.data.submitData.user_no==''){
			api.showToast('请输入代理NO搜索','none')
		}else{
			self.data.isSearch = true;
			self.data.searchItem.parent_no = self.data.submitData.user_no;
			self.data.searchItem.level = 1;
			self.data.searchItemTwo.child_no = self.data.submitData.user_no;
			self.getMainData(true);
			self.getTopData()
		};
		self.setData({
			web_isSearch:self.data.isSearch
		})
	},
	
	onPullDownRefresh() {
		const self = this;
		wx.showNavigationBarLoading();
		self.data.searchItem.parent_no=wx.getStorageSync('agentInfo').user_no;
		self.data.searchItemTwo.parent_no=wx.getStorageSync('agentInfo').user_no;
		self.data.searchItem.level = 2;
		delete self.data.searchItemTwo.child_no;
		self.data.isSearch = false;
		self.data.submitData.user_no = '';
		self.getMainData(true);
		self.getTopData()
		self.setData({
			web_submitData:self.data.submitData,
			web_isSearch:self.data.isSearch
		})
	
	},

	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self)
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.tokenFuncName = 'getAgentToken';
		postData.searchItem = api.cloneForm(self.data.searchItem);
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
			setTimeout(function()
			{
			  wx.hideNavigationBarLoading();
			  wx.stopPullDownRefresh();
			},300);
			self.setData({
				web_mainData: self.data.mainData
			})
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		};
		api.distributionGet(postData, callback);
	},

	getTopData() {
		const self = this;
		self.data.topData = [];
		const postData = {};
		postData.tokenFuncName = 'getAgentToken';
		postData.searchItem = api.cloneForm(self.data.searchItemTwo);
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
					self.data.lessCount  = self.data.shopCount - self.data.authCount
				}
				
			}
			self.setData({
				web_shopCount: self.data.shopCount,
				web_authCount: self.data.authCount,
				web_topData: self.data.topData,
				web_lessCount:self.data.lessCount
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
	
	changeBind(e) {
		const self = this;
		api.fillChange(e, self, 'submitData');
		console.log('self.data.submitData', self.data.submitData)
		self.setData({
			web_submitData: self.data.submitData,
		});
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

  