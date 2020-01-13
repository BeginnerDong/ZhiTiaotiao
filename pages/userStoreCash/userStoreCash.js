//logs.js
import {
	Api
} from '../../utils/api.js';
var api = new Api();

import {
	Token
} from '../../utils/token.js';
const token = new Token();

Page({
	data: {
		is_show: false,
		searchItem: {},
		submitData: {
			count: ''
		},
		isFirstLoadAllStandard: ['getUserInfoData', 'getAboutData','getHfInfoData'],
		chooseType:0,
		bankData: [],
		is_rule:false
	},

	onLoad(options) {
		const self = this;
		self.data.type = options.type;
		api.commonInit(self);
		self.getUserInfoData()
		self.getAboutData();
		self.getHfInfoData();
		self.setData({
			web_type:self.data.type,
			web_chooseType:self.data.chooseType
		})
	},
	
	
	getHfInfoData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getStoreToken';
		postData.searchItem = {
			user_no:wx.getStorageSync('storeInfo').user_no
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.hfInfoData = res.info.data[0];
				self.getBankData()
				self.data.hfInfoData.bank_acct_no = self.data.hfInfoData.bank_acct_no.substring(self.data.hfInfoData.bank_acct_no.length-4);
			};
			self.setData({
				web_hfInfoData: self.data.hfInfoData
			})
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getHfInfoData', self);
		};
		api.hfInfoGet(postData, callback);
	},
	
	getBankData(){
		const self = this;
		var type = ''
		if(self.data.hfInfoData.type==1){
			type="企业取现银行列表"
		}else if(self.data.hfInfoData.type==2){
			type="个人取现银行列表"
		};
		const postData = {};
		postData.searchItem = {
			thirdapp_id: 2,
		};
		postData.getBefore = {
			caseData: {
				tableName: 'Label',
				searchItem: {
					title: ['in', [type]],
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
					if(res.info.data[i].description==self.data.hfInfoData.bank_id){
						self.data.hfInfoData.bankName = res.info.data[i].title
					}
				}
			}
			self.setData({
				web_hfInfoData: self.data.hfInfoData
			})
			console.log('self.data.bankData',self.data.bankData)
		};
		api.labelGet(postData, callback);
	},
	
	
	getUserInfoData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getStoreToken';
		postData.searchItem = {
			user_no:wx.getStorageSync('storeInfo').user_no
		};
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

	flowLogAdd() {
		const self = this

		const postData = {
			data: {
				count: -self.data.submitData.count,
				trade_info: '提现',
				status: 1,
				type: 2,
				thirdapp_id: 2,
				withdraw_type:self.data.chooseType,
				user_no:wx.getStorageSync('storeInfo').user_no
			}
		};
		if(self.data.type==2){
			postData.data.type = 4,
			postData.data.behavior = 2
		};
		postData.tokenFuncName = 'getStoreToken';
		if (self.data.userInfoData.cash_bind_card_id.length == 0) {
			api.buttonCanClick(self, true);
			api.showToast('请绑定银行卡', 'none');
			return;
		};
		const callback = (res) => {
			api.buttonCanClick(self, true)
			if (res.solely_code == 100000) {
				api.showToast('申请成功', 'none');
				setTimeout(function() {
					wx.navigateBack({
						delta: 1
					})
				}, 1000);
			}else{
				api.showToast(res.msg, 'none');
			}
		};
		api.flowLogAdd(postData, callback)
	},
	
	choose(e){
		const self = this;
		var type = api.getDataSet(e,'type');	
		if(type!=self.data.chooseType){
			self.data.chooseType = type;
			self.setData({
				web_chooseType:self.data.chooseType
			})
		}
	},

	submit() {
		const self = this;
		api.buttonCanClick(self);
		const pass = api.checkComplete(self.data.submitData);
		console.log('pass', pass)
		if (pass) {
			if(self.data.chooseType==0){
				api.buttonCanClick(self, true);
				
				api.showToast('请选择提现方式', 'none');
				return
			}
			if(self.data.type==1){
				if(parseFloat(self.data.submitData.count)>parseFloat(self.data.userInfoData.balance)){
					api.buttonCanClick(self, true);
					
					api.showToast('货款不足', 'none');
					return
				}
			}else{
				if(self.data.submitData.count>self.data.userInfoData.reward){
					api.buttonCanClick(self, true);
					
					api.showToast('联盟金不足', 'none');
					return
				}
			}		
			self.flowLogAdd()
		} else {
			api.buttonCanClick(self, true);

			api.showToast('请输入提现金额', 'none')
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
					title: ['=', ['货款提现规则']],
				},
				middleKey: 'menu_id',
				key: 'id',
				condition: 'in'
			},
		};
		if(self.data.type==2){
			postData.getBefore.label.searchItem.title = ['=',['联盟金提现规则']]
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

	is_show() {
		const self = this;
		self.data.is_show = !self.data.is_show;
		self.setData({
			is_show: self.data.is_show
		})
	},
  rule() {
    const self = this;
    self.data.is_rule = !self.data.is_rule;
    self.setData({
      is_rule: self.data.is_rule
    })
  },
	allOut() {
		const self = this;
		if(self.data.type==2){
			self.data.submitData.count = self.data.userInfoData.reward;
		}else{
			self.data.submitData.count = self.data.userInfoData.balance;
		}
		
		self.setData({
			web_submitData: self.data.submitData
		})
	},

	changeBind(e) {
		const self = this;
		api.fillChange(e, self, 'submitData');
		console.log('self.data.submitData', self.data.submitData)
		self.setData({
			web_submitData: self.data.submitData,
		});
	},


	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},
})
