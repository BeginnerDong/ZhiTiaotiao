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
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = api.cloneForm(self.data.searchItem);
		postData.searchItem.user_no = ['in', [wx.getStorageSync('info').user_no, 'U910872296194660']];
		postData.searchItem.type = ['in', [1, 2, 3, 4, 5]];
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
				for (var i = 0; i < self.data.mainData.length; i++) {
					self.data.mainData[i].content = api.wxParseReturn(res.info.data[i].content).nodes;
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
		api.messageGet(postData, callback);
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
