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
		bankData: [{
			name: '兴业银行',
			value: '03090000'
		}, {
			name: '华夏银行',
			value: '03040000'
		}, {
			name: '北京银行',
			value: '03130011'
		}, {
			name: '招商银行',
			value: '03080000'
		}, {
			name: '中国工商银行',
			value: '01020000'
		}, {
			name: '中国建设银行',
			value: '01050000'
		}, {
			name: '中国农业银行',
			value: '01030000'
		}, {
			name: '光大银行',
			value: '03030000'
		}, {
			name: '北京农村商业银行',
			value: '04020011'
		}, {
			name: '中国银行',
			value: '01040000'
		}, {
			name: '中国邮政储蓄银行',
			value: '04030000'
		}, {
			name: '南京银行',
			value: '03133201'
		}, {
			name: '杭州银行',
			value: '03133301'
		}, {
			name: '浙商银行',
			value: '03160000'
		}, {
			name: '上海银行',
			value: '03130031'
		}, {
			name: '渤海银行',
			value: '03180000'
		}, {
			name: '上海农村商业银行',
			value: '04020031'
		}, {
			name: '广东发展银行',
			value: '03060000'
		}, {
			name: '民生银行',
			value: '03050000'
		}, {
			name: '浦东发展银行',
			value: '04020031'
		}, {
			name: '平安银行',
			value: '03134402'
		}, {
			name: '浙江民泰商业银行',
			value: '03133307'
		}, {
			name: '浙江泰隆商业银行',
			value: '31330000'
		}, {
			name: '深圳发展银行',
			value: '03070000'
		}, {
			name: '中信银行',
			value: '03020000'
		}, {
			name: '交通银行',
			value: '03010000'
		}],
	
	},
	//事件处理函数


	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.getHfInfoData();
		
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
