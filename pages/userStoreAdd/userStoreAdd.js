import {Api} from '../../utils/api.js';
var api = new Api();

import {Token} from '../../utils/token.js';
var token = new Token();

Page({

  data: {
		buttonCanClick:true,
		submitData:{
			title:'',
			mainImg:[],
			bannerImg:[],
			category_id:7,
			price:'',
			score:'',
			content:''
		}
  },

  onLoad(){
    const self = this;
    self.setData({
		web_submitData:self.data.submitData,
      web_buttonCanClick:self.data.buttonCanClick
    })
  },
	
	upLoadBannerImg() {
		const self = this;
		if (self.data.submitData.bannerImg.length > 2) {
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
	
				self.data.submitData.bannerImg.push({
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
					tokenFuncName: 'getStoreToken',
					type:'image'
				}, callback)
			},
			fail: function(err) {
				wx.hideLoading();
			}
		})
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
					tokenFuncName: 'getStoreToken',
					type:'image'
				}, callback)
			},
			fail: function(err) {
				wx.hideLoading();
			}
		})
	},
	
	productAdd() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getStoreToken';
		postData.data = {};
		postData.data = api.cloneForm(self.data.submitData);
		const callback = (data) => {
			if (data.solely_code == 100000) {
				api.buttonCanClick(self, true);
				api.showToast('添加成功', 'none')
				self.data.submitData = {
					title:'',
					mainImg:[],
					bannerImg:[],
					category_id:7,
					price:'',
					score:''
				};
				self.setData({
				  web_submitData:self.data.submitData,
				});
			} else {
				api.showToast('网络故障', 'none')
			};	
		};
		api.productAdd(postData, callback);
	},
	
	submit() {
		const self = this;
		api.buttonCanClick(self);

	  
		const pass = api.checkComplete(self.data.submitData);
		console.log('pass',pass)
		if (pass) {
				self.productAdd()
		} else {
			api.buttonCanClick(self,true);
			api.showToast('请补全信息', 'none');
		};
	},
	
  bindInputChange(e){
    const self = this;
    api.fillChange(e,self,'submitData');
    self.setData({
      web_submitData:self.data.submitData,
    });
  },
	
	
  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },
  
})

  