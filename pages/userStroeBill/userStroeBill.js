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
		is_rule:false,
		time: 2019 - 9 - 9,
		currentId: 0,
		searchItem: {
			status:['in',[0,1,-1]],
			type:2,
			user_no:wx.getStorageSync('storeInfo').user_no,
			count:['>',0]
		},
		mainData:[],
		isFirstLoadAllStandard:['getMainData','getUserInfoData','rewardParamGet','getTodayData','getAboutData'],
		startTime:'',
		endTime:'',
		todayMoney:''
		
	},
	//事件处理函数
	
	tab(e){
	 this.setData({
	    currentId:e.currentTarget.dataset.id
	  })
	},
	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.data.searchItem.user_no = wx.getStorageSync('storeInfo').user_no;
		self.getMainData();
		self.getUserInfoData();
		self.rewardParamGet();
		self.getTodayData();
		self.getAboutData();
		self.setData({
			web_currentId: self.data.currentId
		})
	},
	
	rule(){
		const self = this;
		self.data.is_rule = !self.data.is_rule;
		self.setData({
			is_rule:self.data.is_rule
		})
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
					title: ['=', ['联盟金结算规则']],
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
	
	getTodayData() {
		const self = this;
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.tokenFuncName = 'getStoreToken';
		postData.searchItem = api.cloneForm(self.data.searchItem);
		
		postData.searchItem.user_no=wx.getStorageSync('storeInfo').user_no;
		postData.searchItem.create_time = ['between',[new Date(new Date().toLocaleDateString()).getTime()/1000,
		new Date(new Date().toLocaleDateString()).getTime() +24 * 60 * 60  -1]]
		postData.order = {
			create_time: 'desc',
		};
		postData.compute = {
		  totalCount:[
			'sum',
			'count',
			api.cloneForm(self.data.searchItem)
		  ],  
		};
		postData.compute.totalCount[2].user_no = wx.getStorageSync('storeInfo').user_no;
		postData.compute.totalCount[2].create_time = ['between',[new Date(new Date().toLocaleDateString()).getTime()/1000,
		new Date(new Date().toLocaleDateString()).getTime() +24 * 60 * 60  -1]]
		const callback = (res) => {
			if(res.solely_code==100000){
				self.data.todayItem = res.info.total;
				self.data.todayMoney = res.info.compute.totalCount
			}
			console.log('2',self.data.todayMoney)
			self.setData({
				web_todayItem:self.data.todayItem,
				web_todayMoney:self.data.todayMoney
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getTodayData', self)
		};
		api.flowLogGet(postData, callback);
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
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'rewardParamGet', self);
		};
		api.rewardParamGet(postData, callback);
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
	
	getMainData(isNew) {
		const self = this;
		var totalCount = 0;
		if (isNew) {
			api.clearPageIndex(self);
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.tokenFuncName = 'getStoreToken';
		postData.searchItem = api.cloneForm(self.data.searchItem);
		postData.searchItem.count = ['>',0];
		postData.order = {
			create_time: 'desc',
		};
		if(self.data.currentId==0){
			postData.getAfter = {
				order: {
					tableName: 'Order',
					middleKey: 'order_no',
					key: 'order_no',
					searchItem: {
						status: 1,
						user_type:0
					},
					condition: '=',
					info:['price']
				}
			};
		};
		postData.compute = {
		  totalCount:[
			'sum',
			'count',
			{status:['in',[0,1,-1]],
			type:2,
			user_no:wx.getStorageSync('storeInfo').user_no,
			count:['>',0]}
		  ],  
		};
		if(self.data.currentId==2){
			postData.compute.totalCount[2].behavior = 2
			postData.compute.totalCount[2].type = 4
		};
		//postData.compute.totalCount[2].count = ['>',0]
		const callback = (res) => {
			api.buttonCanClick(self,true);
			if (res.info.data.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data);
				if(self.data.currentId==2){
					for (var i = 0; i < self.data.mainData.length; i++) {
						self.data.mainData[i].create_time = self.data.mainData[i].create_time.substring(0,10)
					}
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
				web_totalCount: res.info.compute.totalCount,
				web_mainData: self.data.mainData,
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self)
		};
		api.flowLogGet(postData, callback);
	},
	
	getReward(isNew) {
		const self = this;
		var totalCount = 0;
		if (isNew) {
			api.clearPageIndex(self);
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.tokenFuncName = 'getStoreToken';
		
		const callback = (res) => {
			api.buttonCanClick(self,true);
			if (res.info.data.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data);
				console.log('1',res.info.today_price)
				console.log('2',self.data.todayMoney)
				console.log('3',self.data.rewardData.alliance_ratio);
				var todayRatioMoney = parseFloat(self.data.todayMoney)*(1-parseFloat(self.data.userInfoData.ratio)/100)*(parseFloat(self.data.rewardData.alliance_ratio)/100);
				var ratio = (1-parseFloat(self.data.userInfoData.ratio)/100)*(parseFloat(self.data.rewardData.alliance_ratio)/100);
				self.data.reduceMoney = Math.ceil((parseFloat(res.info.today_price) - parseFloat(todayRatioMoney))/ratio);
				/* /(1-parseFloat(self.data.userInfoData.ratio)/100)*(parseFloat(self.data.rewardData.alliance_ratio)/100); */
				console.log('self.data.reduceMoney',self.data.reduceMoney);
				console.log('todayRatio',todayRatioMoney);
			
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
				web_reduceMoney:self.data.reduceMoney,
				web_totalCount: res.info.total_price,
				web_today:res.info.today_price,
				web_mainData: self.data.mainData,
			});
			console.log(self.data.mainData)
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self)
		};
		api.getReward(postData, callback);
	},
	
	
	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll) {
			self.data.paginate.currentPage++;
			if(self.data.currentId!=1){
				self.getMainData();
			}else{
				self.getReward();
			}
			
		};
	},
	
	tab(e) {
		const self = this;
		
		self.data.mainData = [];
		self.setData({
			web_mainData:self.data.mainData
		});
		if(self.data.currentId!=api.getDataSet(e,'id')){
			api.buttonCanClick(self);
			self.data.currentId=api.getDataSet(e,'id');
			if(self.data.currentId==1){
				self.getReward(true)
				
			}else if(self.data.currentId==0){
				self.data.searchItem = {
					status:['in',[1,0,-1]],
					type:2,
					user_no:wx.getStorageSync('storeInfo').user_no,
					
				};
				self.getMainData(true);
			}if(self.data.currentId==2){
				self.data.searchItem = {
					status:['in',[1,0,-1]],
					type:4,
					
					user_no:wx.getStorageSync('storeInfo').user_no,
					
				}
				self.getMainData(true);
			}
			
			self.setData({
				web_currentId: self.data.currentId
			})
		}
	},

	
	
	
	
	onPullDownRefresh(){
	  const self = this;
	  wx.showNavigationBarLoading(); 
	  delete self.data.searchItem.create_time;
	  self.setData({
	    web_startTime:'',
	    web_endTime:'',
	  });
	  self.getMainData(true);
	},
	
	bindTimeChange: function(e) {
	  const self = this;
	  var label = api.getDataSet(e,'type');
	  this.setData({
	    ['web_'+label]: e.detail.value
	  });
	  self.data[label+'stap'] = new Date(self.data.date+' '+e.detail.value).getTime()/1000;
	  if(self.data.endTimestap&&self.data.startTimestap){
	    self.data.searchItem.create_time = ['between',[self.data.startTimestap,self.data.endTimestap]];
	  }else if(self.data.startTimestap){
	    self.data.searchItem.create_time = ['>',self.data.startTimestap];
	  }else{
	    self.data.searchItem.create_time = ['<',self.data.endTimestap];
	  };
	  self.getMainData(true);   
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
