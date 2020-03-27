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
		mainData: [],
		searchItem: {
			type:3,
			behavior:2
		},
		mainData1:[{}],
		is_receiveOk:false,
		isFirstLoadAllStandard: ['getMainData']
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.getMainData();
		console.log(new Date())
		console.log()
	},



	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self);
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			step:0
		},
		postData.getAfter = {
			shopInfo:{
				tableName:'ShopInfo',
				middleKey:'shop_no',
				key:'user_no',
				searchItem:{
					status:1
				},
				condition:'=',
				info:['name']
			}
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data);
				for (var i = 0; i < self.data.mainData.length; i++) {
					self.data.mainData[i].deadline = api.getBeforeDate(parseInt(self.data.mainData[i].deadline)*1000);
					self.data.mainData[i].create_time = self.data.mainData[i].create_time.substring(0,10)
				}
			} else {
				self.data.isLoadAll = true;
				api.showToast('没有更多了', 'none');
			};
			self.setData({
				web_mainData: self.data.mainData,
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self)
		};
		api.zttRecordGet(postData, callback);
	},
	
	receiveAll(){
		const self = this;
		api.buttonCanClick(self);
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		const callback = (res) => {
			if (res.solely_code==100000) {
				self.data.is_receiveOk = true;
				self.setData({
					is_receiveOk:self.data.is_receiveOk
				})
			} else {
				api.showToast(res.msg, 'none');
			};
			api.buttonCanClick(self,true);
		};
		api.batchReceive(postData, callback);
	},
	
	receive(e){
		const self = this;
		api.buttonCanClick(self);
		var index = api.getDataSet(e,'index');
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		postData.data = {
			step:1
		};
		postData.searchItem = {
			id:self.data.mainData[index].id
		};
		const callback = (res) => {
			if (res.solely_code==100000) {
				self.data.is_receiveOk = true;
				self.setData({
					is_receiveOk:self.data.is_receiveOk
				})
			} else {
				api.showToast(res.msg, 'none');
			};
			api.buttonCanClick(self,true);
		};
		api.zttRecordUpdate(postData, callback);
	},
	
	close(){
		const self = this;
		self.getMainData(true);
		self.data.is_receiveOk = false;
		self.setData({
			is_receiveOk:self.data.is_receiveOk
		})
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

})
