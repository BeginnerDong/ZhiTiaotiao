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
			content: '',
			mainImg: [],
			phone: ''
		},
		buttonCanClick: true

	},

	onLoad() {
		const self = this;
		self.setData({
			web_buttonCanClick: self.data.buttonCanClick
		})
	},

	messageAdd() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		postData.data = {};
		postData.data = api.cloneForm(self.data.submitData);
		const callback = (data) => {
			if (data.solely_code == 100000) {
				api.buttonCanClick(self, true);
				api.showToast('提交成功', 'none')
				self.data.submitData = {
					content: '',
					mainImg: [],
					phone: ''
				};
				self.setData({
					web_submitData: self.data.submitData,
				});
			} else {
				api.showToast('网络故障', 'none')
			};
		};
		api.messageAdd(postData, callback);
	},

	submit() {
		const self = this;
		api.buttonCanClick(self);
		var phone = self.data.submitData.phone;
		var newObject = api.cloneForm(self.data.submitData);
		delete newObject.mainImg;
		delete newObject.phone;
		console.log('newObject', newObject)
		const pass = api.checkComplete(newObject);
		console.log('pass', pass)
		if (pass) {
			if (phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {
				api.buttonCanClick(self, true);
				api.showToast('手机格式错误', 'none')
			} else {
				self.messageAdd();
			}
		} else {
			api.buttonCanClick(self, true);
			api.showToast('请补全信息', 'none');
		};
	},
	upLoadMainImg() {
		const self = this;
		if (self.data.submitData.mainImg.length > 2) {
			api.showToast('仅限3张', 'fail');
			return;
		};
		wx.showLoading({
			mask: true,
			title: '图片上传中',
		});
		const callback = (res) => {
			console.log('res', res)
			if (res.solely_code == 100000) {
	
				self.data.submitData.mainImg.push({
					url: res.info.url
				})
				self.setData({
					web_submitData: self.data.submitData
				});
				wx.hideLoading()
				console.log('self.data.submitData',self.data.submitData)
			} else {
				api.showToast('网络故障', 'none')
			}
		};
	
		wx.chooseImage({
			count: 1,
			success: function(res) {
				console.log(res);
				var tempFilePaths = res.tempFilePaths;
				console.log(callback)
				api.uploadFile(tempFilePaths[0], 'file', {
					tokenFuncName: 'getProjectToken'
				}, callback)
			},
			fail: function(err) {
				wx.hideLoading();
			}
		})
	},

	bindInputChange(e) {
		const self = this;
		api.fillChange(e, self, 'submitData');
		self.setData({
			web_submitData: self.data.submitData,
		});
	},

	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},

})
