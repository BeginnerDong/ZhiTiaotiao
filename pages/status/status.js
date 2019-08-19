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
		isFirstLoadAllStandard: ['getMainData'],
		num: 1,
		select_data:'',
		is_rule: false,
		mainData: [],
		rankData:[],
		searchItem: {
			type: 3,
		},
		searchItemTwo:{
			settlement:1,
		
		},
		show:false,
		isFirstLoadAllStandard: ['getMainData','getAboutData','check']
	},
	
	onLoad() {
		const self = this;
		api.commonInit(self);
		 var date=new Date;
		 var year=date.getFullYear(); 
		 var month=date.getMonth();
		 self.data.select_data = year+'年'+month+'月',
		
		self.setData({
			web_select_data:self.data.select_data,
			web_month:month,
			web_num: self.data.num
		})
	},
	
	onShow(e){
		const self = this;
		self.check();
	},
	
	check() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		const callback = (res) => {
			if (res.info.data.length > 0) {
	
				if (res.info.data[0].info.phone=='') {
					api.pathTo('/pages/userLogin/userLogin', 'redi')
				} else {
					self.getMainData();
					self.getAboutData();
					self.getZtt();
					self.data.show = true
				};
				self.setData({
					show: self.data.show
				})
			};
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'check', self);
		};
		api.userGet(postData, callback);
	},
	
	getZtt() {
		const self = this;
		
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		const callback = (res) => {
			
			if (res.solely_code==100000) {
				self.data.ztt = res.info
			}
			self.setData({
				web_ztt:self.data.ztt
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getZtt', self)
			console.log('self.data.mainData',self.data.mainData)
		};
		api.getZtt(postData, callback);
	},

	getMainData(isNew) {
		const self = this;
		var totalCount = 0;
		if (isNew) {
			api.clearPageIndex(self);
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = api.cloneForm(self.data.searchItem)
		postData.order = {
			create_time: 'desc',
		};
	
		postData.compute = {
		  totalCount:[
			'sum',
			'count',
			{type:3,user_no:wx.getStorageSync('info').user_no}
		  ],  
		};
		const callback = (res) => {
			api.buttonCanClick(self,true);
			if (res.info.data.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data);
			} else {
				self.data.isLoadAll = true;
				
			};
			self.setData({
				web_totalCount: res.info.compute.totalCount,
				web_mainData: self.data.mainData,
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self)
			console.log('self.data.mainData',self.data.mainData)
		};
		api.flowLogGet(postData, callback);
	},

	getRankData(isNew) {
		const self = this;
		var totalCount = 0;
		if (isNew) {
			api.clearPageIndex(self);
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = api.cloneForm(self.data.searchItemTwo);
		postData.searchItem.user_type = 0;
		postData.order = {
			consume:'desc'
		};
		postData.getAfter = {
			user: {
				tableName: 'User',
				middleKey: 'user_no',
				key: 'user_no',
				searchItem: {
					status: 1
				},
				condition: '=',
				info: ['nickname','headImgUrl']
			}
		};
		if(self.data.num==3){
			postData.compute = {
			  totalCount:[
				'sum',
				'consume',
				api.cloneForm(self.data.searchItemTwo)
			  ],  
			};
			postData.compute.totalCount[2].user_no = wx.getStorageSync('info').user_no;
			postData.compute.totalCount[2].user_type= 0
		}
		
		const callback = (res) => {
			api.buttonCanClick(self,true);
			if (res.info.data.length > 0) {
				
				self.data.rankData.push.apply(self.data.rankData, res.info.data);
			} else {
				self.data.isLoadAll = true;
				
			};
			if(self.data.num==3){
				self.setData({
					web_totalCount: res.info.compute.totalCount,
				});
			}
			self.setData({
				web_rankData: self.data.rankData,
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getRankData', self)
		};
		api.rankGet(postData, callback);
	},

	

	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll) {
			self.data.paginate.currentPage++;
			self.getMainData();
		};
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
					title: ['=', ['用户知条规则']],
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

	changeNav(e) {
		const self = this;
		api.buttonCanClick(self);
		self.setData({
			web_totalCount:0.00
		});
		self.data.num = api.getDataSet(e, 'num');
		if(self.data.num==2){
			self.data.rankData = [];
			self.data.searchItemTwo = {
				settlement:1,
				
			}
			self.getRankData(true)
		}else if(self.data.num==3){
			self.data.rankData = [];
			self.data.searchItemTwo = {
				settlement:2,
				isget:1
			}
			self.getRankData(true)
		}else if(self.data.num==1){
			self.getMainData(true)
		}
		
		self.setData({
			web_num: self.data.num
		})
	},

	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},

	changeDate(e) {
		const self = this;
		console.log(e)
		var dateArray = e.detail.value.split('-');
		console.log(dateArray)
		self.data.select_data =dateArray[0]+'年'+dateArray[1]+'月';
		self.setData({
			web_month:dateArray[1],
			web_select_data: self.data.select_data
		})
	},
	rule(e) {
		const self = this;
		self.data.is_rule = !self.data.is_rule;
		self.setData({
			is_rule: self.data.is_rule
		})
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
