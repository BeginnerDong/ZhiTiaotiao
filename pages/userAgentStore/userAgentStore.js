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
		scoreData: [],
		mainData: [],
		memberData: [],
		isFirstLoadAllStandard: ['getMainData', 'getScoreData', 'getMemberData']
	},
	//事件处理函数


	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.getMainData();
		self.getScoreData();
		self.getMemberData()
	},

	getMainData(isNew) {
		const self = this;
		if(isNew){
			api.clearPageIndex(self)
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.tokenFuncName = 'getAgentToken';
		postData.searchItem = {
			user_type: 1
		};
		postData.getBefore = {
			child: {
				tableName: 'Distribution',
				middleKey: 'user_no',
				key: 'child_no',
				searchItem: {
					status: ['in', [1]],
				},
				fixSearchItem: {
					parent_no: ['in', [wx.getStorageSync('agentInfo').user_no]],
					level: ['in', [1]],
				},
				condition: 'in'
			}
		};
		postData.order = {
			create_time: 'desc'
		}
		const callback = (res) => {
			if (res.solely_code == 100000) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data)
			};
			self.setData({
				web_mainData: self.data.mainData
			})
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		};
		api.userInfoGet(postData, callback);
	},

	getScoreData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getAgentToken';
		postData.searchItem = {
			user_type: 1
		};
		postData.getBefore = {
			child: {
				tableName: 'Distribution',
				middleKey: 'user_no',
				key: 'child_no',
				searchItem: {
					status: ['in', [1]],
				},
				fixSearchItem: {
					parent_no: ['in', [wx.getStorageSync('agentInfo').user_no]],
					level: ['in', [1]],
				},
				condition: 'in'
			}
		};
		postData.order = {
			score: 'desc'
		}
		const callback = (res) => {
			if (res.solely_code == 100000) {
				self.data.scoreData.push.apply(self.data.scoreData, res.info.data);
				if (res.info.data.length > 3) {
					self.data.scoreData = self.data.scoreData.slice(0, 3)
				}
			};
			self.setData({
				web_scoreData: self.data.scoreData
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getScoreData', self);
		};
		api.userInfoGet(postData, callback);
	},

	getMemberData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getAgentToken';
		postData.searchItem = {
			user_type: 1
		};
		postData.getBefore = {
			child: {
				tableName: 'Distribution',
				middleKey: 'user_no',
				key: 'child_no',
				searchItem: {
					status: ['in', [1]],
				},
				fixSearchItem: {
					parent_no: ['in', [wx.getStorageSync('agentInfo').user_no]],
					level: ['in', [1]],
				},
				condition: 'in'
			}
		};
		postData.order = {
			mem_num: 'desc'
		}
		const callback = (res) => {
			if (res.solely_code == 100000) {
				self.data.memberData.push.apply(self.data.memberData, res.info.data);
				if (res.info.data.length > 3) {
					self.data.memberData = self.data.memberData.slice(0, 3)
				}
			};
			self.setData({
				web_memberData: self.data.memberData
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMemberData', self);
		};
		api.userInfoGet(postData, callback);
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
