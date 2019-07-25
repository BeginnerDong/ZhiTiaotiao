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
		disabled: true,
		isFirstLoadAllStandard: ['getMainData','getAboutData'],
		submitData: {
			phone: '',
		},
		is_rule: false
	},
	rule(e) {
		const self = this;
		self.data.is_rule = !self.data.is_rule;
		self.setData({
			is_rule: self.data.is_rule
		})
	},
	//事件处理函数
	preventTouchMove: function(e) {

	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.getMainData();
		self.getAboutData()
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
					title: ['=', ['用户服务协议']],
				},
				middleKey: 'menu_id',
				key: 'id',
				condition: 'in'
			},
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

	getMainData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		const callback = (res) => {
			if (res.info.data.length > 0) {

				if (!JSON.stringify(res.info.data[0].info.phone) == '') {
					api.pathTo('/pages/status/status', 'redi')
				} else {
					self.data.isShow = true
				};
				self.setData({
					web_isShow: self.data.isShow
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
		postData.smsAuth = {
			code:self.data.submitData.code,
			phone:self.data.submitData.phone
		};
		const callback = (data) => {
			if (data.solely_code == 100000) {
				api.showToast('登录成功', 'none');
				api.pathTo('/pages/status/status', 'redi')
			} else {
				api.showToast('网络故障', 'none')
			};
			api.buttonCanClick(self, true);
		};
		api.userInfoUpdate(postData, callback);
	},
	
	
	rule(){
		const self = this;
		self.data.is_rule = !self.data.is_rule;
		self.setData({
			is_rule:self.data.is_rule
		})
	},

	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},

	intoPathRedirect(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'redi');
	},


})
