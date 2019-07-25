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
		submitData: {
			code:'',
			phone:'',
			password_new: '',
			password_new_copy: '',
		},
		customItem: '全部',
		text: '获取验证码', //按钮文字
		currentTime: 61, //倒计时 
		buttonCanClick: true,
		type: 'password',
		type1:'password'
	},




	onLoad() {
		const self = this;
		self.setData({
			web_type: self.data.type,
			web_type1: self.data.type1,
			web_buttonCanClick: self.data.buttonCanClick
		})
		
	},
	
	changeType() {
		const self = this;
		if (self.data.type == 'password') {
			self.data.type = 'text'
		} else if (self.data.type == 'text') {
			self.data.type = 'password'
		}
		self.setData({
			web_type: self.data.type
		})
	
	},
	
	changeType1() {
		const self = this;
		if (self.data.type1 == 'password') {
			self.data.type1 = 'text'
		} else if (self.data.type1 == 'text') {
			self.data.type1 = 'password'
		}
		self.setData({
			web_type1: self.data.type1
		})
	
	},


	resetPassword() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		postData.smsAuth = {
			code:self.data.submitData.code,
			phone:self.data.submitData.phone
		};
		postData.data = {
			password: self.data.submitData.password_new,
			phone:self.data.submitData.phone
		};
		const callback = (res) => {
			const pass = api.dealRes(res);
			if (pass) {
				api.showToast('修改成功', 'none');
				wx.navigateBack({
					delta: 1
				})
			}
		};
		api.resetPassword(postData, callback);
	},
	
	getCode() {
		var self = this;
		api.buttonCanClick(self);
		var phone = self.data.submitData.phone;
		var currentTime = self.data.currentTime //把手机号跟倒计时值变例成js值
		if (self.data.submitData.phone == '') {
			api.buttonCanClick(self, true);
			api.showToast('手机号码不能为空', 'none');
			return
		} else if (phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {
			api.buttonCanClick(self, true);
			api.showToast('手机号格式不正确', 'none');
			return
		} else {
			//当手机号正确的时候提示用户短信验证码已经发送
			const postData = {
				data: {
					thirdapp_id: 2,
					phone: self.data.submitData.phone
				}
			};
			const callback = (res) => {
				if (res.solely_code == 100000) {
					api.buttonCanClick(self, true);
					api.showToast('验证码已发送', 'none');
					//设置一分钟的倒计时
					var interval = setInterval(function() {
						currentTime--; //每执行一次让倒计时秒数减一
						self.setData({
							text: currentTime + 's', //按钮文字变成倒计时对应秒数
						})
						//如果当秒数小于等于0时 停止计时器 且按钮文字变成重新发送 且按钮变成可用状态 倒计时的秒数也要恢复成默认秒数 即让获取验证码的按钮恢复到初始化状态只改变按钮文字
						if (currentTime <= 0) {
							clearInterval(interval)
							self.setData({
								text: '重新发送',
								currentTime: 61,
							})
						}
	
					}, 1000);
				} else {
					api.buttonCanClick(self, true);
					api.showToast(res.msg, 'none')
				}
			};
			api.codeGet(postData, callback)
		};
	},



	changeBind(e) {
		const self = this;
		api.fillChange(e, self, 'submitData');
		if (self.data.submitData.password_new && self.data.submitData.password_new_copy) {
			if (self.data.submitData.password_new != self.data.submitData.password_new_copy) {
				api.showToast('新旧密码不一致', 'none');
				self.data.submitData.password_new_copy = ''
			};
		};
		self.setData({
			web_submitData: self.data.submitData
		});
	},



	submit() {
		const self = this;
		api.buttonCanClick(self);
		setTimeout(function() {
			const pass = api.checkComplete(self.data.submitData);
			if (pass) {

				self.resetPassword();
			} else {
				api.buttonCanClick(self, true);
				api.showToast('请补全信息', 'none');
			};
		}, 100);
	},


})
