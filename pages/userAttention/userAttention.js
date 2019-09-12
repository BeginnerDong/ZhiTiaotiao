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
		isFirstLoadAllStandard: ['getMainData', 'getLocation'],

		La1: '',
		lo1: ''
	},
	//事件处理函数
	onLoad(options) {
		const self = this;
		api.commonInit(self);
		
	},
	
	onShow(){
		const self = this;
		self.getLocation()
	},

	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self)
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {};
		postData.searchItem.user_type = 1
		postData.order = {
			create_time: 'desc'
		};
		postData.getBefore = {
			relation: {
				tableName: 'Log',
				searchItem: {
					status:['in',[1]],
				},
				fixSearchItem: {
					user_no: ['in', [wx.getStorageSync('info').user_no]],
					type:['in',[5]],
				},
				middleKey: 'id',
				key: 'relation_id',
				condition: 'in',
			}
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data);
				for (var i = 0; i < self.data.mainData.length; i++) {
					self.data.mainData[i].distance =
						api.distance(self.data.la1, self.data.lo1, self.data.mainData[i].latitude, self.data.mainData[i].longitude)
					console.log('self.data.mainData[i].distance', self.data.mainData[i].distance)
				}
			} else {
				self.data.isLoadAll = true;
				api.showToast('没有更多了', 'none')
			}
			self.setData({
				web_mainData: self.data.mainData
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		};
		api.shopInfoGet(postData, callback);
	},

	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll) {
			self.data.paginate.currentPage++;
			self.getMainData();
		};
	},

	getLocation() {
		const self = this;
		const callback = (res) => {
			if (res) {
				self.data.la1 = res.latitude;
				self.data.lo1 = res.longitude
			};
			self.getMainData(true);
		};

		api.getLocation('getGeocoder', callback);
		api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getLocation', self)
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
