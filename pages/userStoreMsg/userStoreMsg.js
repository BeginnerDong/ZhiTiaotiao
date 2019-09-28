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
		mainData: [],
		searchItem: {},
		isFirstLoadAllStandard: ['getMainData']
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);

	},

	onShow() {
		const self = this;
		self.getMainData(true)
	},

	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self)
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.tokenFuncName = 'getStoreToken';
		postData.searchItem = api.cloneForm(self.data.searchItem);
		postData.searchItem.user_no = wx.getStorageSync('storeInfo').user_no;
		postData.searchItem.type = ['in', [7]];
		postData.order = {
			create_time: 'desc'
		};
		postData.getAfter = {
			log: {
				tableName: 'Log',
				middleKey: 'id',
				key: 'relation_id',
				searchItem: {
					status: 1,
					type: 6
				},
				condition: '=',
			}
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data);
			} else {
				self.data.isLoadAll = true;
				api.showToast('没有更多了', 'none')
			}
			self.setData({
				web_mainData: self.data.mainData
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		};
		api.messageGet(postData, callback);
	},
	
	addLog(e) {
		const self = this;
		var index = api.getDataSet(e,'index');
		if(self.data.mainData[index].log.length>0){
			return
		};
		const postData = {};
		postData.data = {
			type:6,
			title: '阅读记录',
			relation_id: self.data.mainData[index].id,
			user_no: wx.getStorageSync('storeInfo').user_no,
		};
		postData.tokenFuncName = 'getStoreToken';
		const callback = (res) => {
			if (res.solely_code == 100000) {
				console.log('已阅读')
				self.data.mainData[index].log.push({title:'已阅读'})
				self.setData({
					web_mainData:self.data.mainData
				})
			} else {
				api.showToast(res.msg, 'none', 1000)
			};
			
		};
		api.logAdd(postData, callback);
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

})
