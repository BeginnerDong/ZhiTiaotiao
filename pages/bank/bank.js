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
		
		isFirstLoadAllStandard: ['getHfInfoData'],
		bankData: [],
	
	},
	//事件处理函数


	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.getHfInfoData();
		self.getBankData();
	},
	
	getBankData(){
		const self = this;
		const postData = {};
		postData.searchItem = {
			thirdapp_id: 2,
		};
		postData.getBefore = {
			caseData: {
				tableName: 'Label',
				searchItem: {
					title: ['in', ['个人取现银行列表']],
				},
				middleKey: 'parentid',
				key: 'id',
				condition: 'in',
			},
		};
		postData.order = {
			listorder:'desc'
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				for (var i = 0; i < res.info.data.length; i++) {
					self.data.bankData.push({name:res.info.data[i].title,value:res.info.data[i].description})
				}
			}
			self.setData({
				bankData: self.data.bankData,
			});
			console.log('self.data.bankData',self.data.bankData)
		};
		api.labelGet(postData, callback);
	},

	getHfInfoData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getAgentToken';
		postData.searchItem = {
			user_no:wx.getStorageSync('storeInfo').user_no
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.hfInfoData = res.info.data[0];
				self.data.hfInfoData.bank_acct_no = self.data.hfInfoData.bank_acct_no.substring(self.data.hfInfoData.bank_acct_no.length-4);
				for (var i = 0; i < self.data.bankData.length; i++) {
					if(self.data.bankData[i].value==self.data.hfInfoData.bank_id){
						self.data.hfInfoData.bankName = self.data.bankData[i].name
					}
				}
			};
			self.setData({
				web_hfInfoData: self.data.hfInfoData
			})
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getHfInfoData', self);
		};
		api.hfInfoGet(postData, callback);
	},
	
	
	
	
	deleteCard() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getThreeToken';
		postData.user_type = 1;
		postData.data = {};
		postData.data = api.cloneForm(self.data.submitData);
		const callback = (data) => {
			api.buttonCanClick(self, true);
			if (data.solely_code == 100000) {
				api.showToast('解绑成功', 'none')
				
			} else {
				api.showToast('网络故障', 'none')
			};
	
		};
		api.bindCard(postData, callback);
	},
/* 	getFlowLogData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getThreeToken';
		postData.searchItem = {
			status:['in',[0,1,-1]]
		};
		const callback = (res) => {

			if (res.info.data.length > 0) {
				self.data.flowlogData.push.apply(self.data.flowlogData,res.info.data)
				
			};
			self.setData({
				web_flowlogData: self.data.flowlogData
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getFlowLogData', self);
		};
		api.flowLogGet(postData, callback);
	}, */



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
	}

})
