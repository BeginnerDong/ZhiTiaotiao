import {Api} from '../../utils/api.js';
var api = new Api();

import {Token} from '../../utils/token.js';
var token = new Token();

Page({

  data: {
    is_edit:true,
		isFirstLoadAllStandard:['getMainData'],
		submitData:{
			title:'',
			price:'',
			score:'',
			mainImg:[],
			bannerImg:[],
		
		}
  },

  onLoad(options){
    const self = this;
		api.commonInit(self);
		self.data.id = options.id;
		self.getMainData()
  },
	
	getMainData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getStoreToken';
		postData.searchItem = {
			id:self.data.id
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData = res.info.data[0];
				self.data.submitData.title = res.info.data[0].title;
				self.data.submitData.price = res.info.data[0].price;
				self.data.submitData.score = res.info.data[0].score;
				
				self.data.submitData.mainImg = res.info.data[0].mainImg;
				self.data.submitData.bannerImg = res.info.data[0].bannerImg;

			}
			self.setData({
				web_submitData:self.data.submitData,
				web_mainData: self.data.mainData
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		};
		api.productGet(postData, callback);
	},
	
	productUpdate() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getStoreToken';
		postData.data = {};
		postData.data = api.cloneForm(self.data.submitData);
		postData.searchItem = {
			id:self.data.id
		};
		const callback = (data) => {
			if (data.solely_code == 100000) {
				api.buttonCanClick(self, true);
				api.showToast('编辑成功', 'none')
				setTimeout(function() {
					wx.navigateBack({
						delta: 1
					});
				}, 300);
			} else {
				api.showToast('网络故障', 'none')
			};
			
		};
		api.productUpdate(postData, callback);
	},
	
	submit() {
		const self = this;
		api.buttonCanClick(self);
		var phone = self.data.submitData.phone;
	  var newObject = api.cloneForm(self.data.submitData);
	  
	  delete newObject.bannerImg;
		console.log('newObject',newObject)
		const pass = api.checkComplete(newObject);
		console.log('pass',pass)
		if (pass) {
		
				self.productUpdate();

		} else {
			api.buttonCanClick(self,true);
			api.showToast('请补全信息', 'none');
		};
	},
	
	upLoadBannerImg() {
		const self = this;
		if (self.data.submitData.bannerImg.length > 9) {
			api.showToast('仅限10张', 'fail');
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
					url: res.info.url,
					type:'image'
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
					url: res.info.url,
					type:'image'
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
	
	deleteImg(e){
		const self = this;
		var index = api.getDataSet(e,'index');
		var type = api.getDataSet(e,'type');
		console.log(type)
		if(type=='mainImg'){
			self.data.submitData.mainImg.splice(index,1);
		}else if(type=='bannerImg'){
			self.data.submitData.bannerImg.splice(index,1);
		};
		console.log(self.data.submitData);
		self.setData({
			web_submitData:self.data.submitData
		})
	},
	
  edit(){
    const self = this;
    self.data.is_edit = !self.data.is_edit
    self.setData({
      is_edit:self.data.is_edit
    })
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

  