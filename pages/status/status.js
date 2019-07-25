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
		
		isFirstLoadAllStandard: ['getMainData','getAboutData']
	},
	onLoad() {
		const self = this;
		api.commonInit(self);
		 var date=new Date;
		 var year=date.getFullYear(); 
		 var month=date.getMonth()+1;
		 self.data.select_data = year+'年'+month+'月',
		self.getMainData();
		
		self.getAboutData();
		self.setData({
			web_select_data:self.data.select_data,
			web_month:month,
			web_num: self.data.num
		})
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
		const callback = (res) => {
			api.buttonCanClick(self,true);
			if (res.info.data.length > 0) {
				for (var i = 0; i < res.info.data.length; i++) {
					console.log(parseFloat(res.info.data[i].count))
					totalCount += parseFloat(res.info.data[i].count)
				};
				self.data.mainData.push.apply(self.data.mainData, res.info.data);
			} else {
				self.data.isLoadAll = true;
				api.showToast('没有更多了', 'none');
			};
			self.setData({
				web_totalCount: totalCount.toFixed(2),
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
		const callback = (res) => {
			api.buttonCanClick(self,true);
			if (res.info.data.length > 0) {
				for (var i = 0; i < res.info.data.length; i++) {
					totalCount += res.info.data[i].count
				};
				self.data.rankData.push.apply(self.data.rankData, res.info.data);
			} else {
				self.data.isLoadAll = true;
				api.showToast('没有更多了', 'none');
			};
			self.setData({
				web_totalCount: totalCount.toFixed(2),
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
					title: ['=', ['知条条奖励规则']],
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
