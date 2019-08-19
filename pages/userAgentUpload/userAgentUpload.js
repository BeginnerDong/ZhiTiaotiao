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
		is_edit: true,
		submitData: {
			mainImg: []
		},
		isFirstLoadAllStandard: ['getMainData']
	},

	onLoad() {
		const self = this;
		self.setData({
			web_submitData:self.data.submitData
		})

	},


	onShow() {
		const self = this;

	},

	deleteImg(e) {
		const self = this;
		self.data.submitData.mainImg.splice(0, 1);
		console.log(self.data.submitData);
		self.setData({
			web_submitData: self.data.submitData
		})
	},



	upLoadBillImg() {
		const self = this;

		wx.showLoading({
			mask: true,
			title: '图片上传中',
		});
		const callback = (res) => {
			console.log('res', res)
			if (res.solely_code == 100000) {
				console.log('self.data.submitData.bill_img', self.data.submitData.bill_img)
				self.data.submitData.mainImg.push({
					url: res.info.url,
					type: 'image'
				})
				self.setData({
					web_submitData: self.data.submitData
				});
				wx.hideLoading()
				console.log('self.data.submitData', self.data.submitData)
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
					tokenFuncName: 'getAgentToken',
					type: 'image'
				}, callback)
			},
			fail: function(err) {
				wx.hideLoading();
			}
		})
	},

	addBill() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getAgentToken';
		postData.data = api.cloneForm(self.data.submitData);
		const callback = (res) => {
			api.buttonCanClick(self,true);
			if(res.solely_code==100000){
				api.showToast('提交成功','none');
				setTimeout(function() {
					wx.navigateBack({
						delta:1
					})
				}, 1000);
			}else{
				api.showToast(res.msg,'none');
			}
		};
		api.addBill(postData, callback);
	},

	submit() {
		const self = this;
		api.buttonCanClick(self);
		const pass = api.checkComplete(self.data.submitData);
		console.log('pass', pass)
		if (pass) {
			self.addBill()
		} else {
			api.buttonCanClick(self, true);
			api.showToast('请上传凭证', 'none');
		};
	},



	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},

})
