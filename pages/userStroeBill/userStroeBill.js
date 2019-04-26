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
		time: 2019 - 9 - 9,
		currentId: 0,
		searchItem: {
			status:['in',[1]],
			type:2,
			behavior:2
		},
		mainData:[],
		isFirstLoadAllStandard:['getMainData','getUserInfoData'],
		startTime:'',
		endTime:''
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
		self.getMainData();
		self.getUserInfoData();
		self.setData({
			web_currentId: self.data.currentId
		})
	},
	
	getUserInfoData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getStoreToken';
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
		postData.tokenFuncName = 'getStoreToken';
		postData.searchItem = api.cloneForm(self.data.searchItem)
		postData.order = {
			create_time: 'desc',
		};
		postData.getAfter = {
			shopInfo: {
				tableName: 'User',
				middleKey: 'consumer_no',
				key: 'user_no',
				searchItem: {
					status: 1
				},
				condition: '=',
				info: ['nickname']
			}
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data);
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
	
	tab(e) {
		const self = this;
		if(self.data.currentId!=api.getDataSet(e,'id')){
			self.data.currentId=api.getDataSet(e,'id');
			if(self.data.currentId==1){
				self.data.searchItem = {
					status:['in',[1,0,-1]],
					type:4,
					behavior:2
				}
			}else if(self.data.currentId==0){
				self.data.searchItem = {
					status:['in',[1]],
					type:2,
					behavior:2
				}
			};
			self.getMainData(true);
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
