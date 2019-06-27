import {Api} from '../../utils/api.js';
var api = new Api();

import {Token} from '../../utils/token.js';
var token = new Token();


	
	Page({
		data: {
			disabled: true,
			isFirstLoadAllStandard: ['getMainData'],
			submitData: {
				phone: '',
			},
			is_rule:false
		},
		rule(e){
			const self=this;
			self.data.is_rule=!self.data.is_rule;
			self.setData({
				is_rule:self.data.is_rule
			})
		},
		//事件处理函数
		preventTouchMove: function(e) {
	
		},
	
		onLoad(options) {
			const self = this;
			api.commonInit(self);
			self.getMainData()
		},
	
	
	
		changeBind(e) {
			const self = this;
			api.fillChange(e, self, 'submitData');
			self.setData({
				web_submitData: self.data.submitData,
			});
			console.log(self.data.submitData)
		},
	
	
	
	
		submit() {
			const self = this;
			api.buttonCanClick(self)
			var phone = self.data.submitData.phone;
			const pass = api.checkComplete(self.data.submitData);
			if (pass) {
				if (phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {
					api.showToast('手机格式错误', 'none')
				} else {
					self.userInfoUpdate()
				}
			} else {
				api.buttonCanClick(self, true);
				api.showToast('请填写手机号', 'none');
				
			};
		},
	
	
	
		getMainData() {
			const self = this;
			const postData = {};
			postData.tokenFuncName = 'getProjectToken';
			const callback = (res) => {
				if (res.info.data.length > 0) {
			
					if(!JSON.stringify(res.info.data[0].info.phone)==''){
						api.pathTo('/pages/status/status','redi')
					}else{
						self.data.isShow = true
					};
					self.setData({
						web_isShow:self.data.isShow
					})
				};
				api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			};
			api.userGet(postData, callback);
		},
	
		userInfoUpdate() {
			const self = this;
			const postData = {};
			postData.tokenFuncName = 'getProjectToken';
			postData.data = {};
			postData.data = api.cloneForm(self.data.submitData);
			const callback = (data) => {
				if (data.solely_code == 100000) {
					api.showToast('登录成功', 'none');
					api.pathTo('/pages/status/status','redi')
				} else {
					api.showToast('网络故障', 'none')
				};
				api.buttonCanClick(self, true);
			};
			api.userInfoUpdate(postData, callback);
		},
	
  
  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },
  
  intoPathRedirect(e) {
  	const self = this;
  	api.pathTo(api.getDataSet(e, 'path'), 'redi');
  },

  
})

  