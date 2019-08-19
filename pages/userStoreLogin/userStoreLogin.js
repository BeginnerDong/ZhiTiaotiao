import {Api} from '../../utils/api.js';
var api = new Api();

import {Token} from '../../utils/token.js';
var token = new Token();

Page({

  data: {

    sForm:{
      login_name:'',
      password:''

    },
    web_show:true,
    code:'',
		type:'password'
  },

 

  onShow(){
    const self = this;
    if(wx.getStorageSync('storeInfo')&&wx.getStorageSync('storeToken')){
        self.setData({
          web_show:false
        });
        wx.redirectTo({
          url: '/pages/userStore/userStore'
        })
    };
		self.setData({
		  web_type:self.data.type
		});
  },

  deleteName(){
  	const self = this;
  	self.data.sForm.password = '',
  	self.setData({
  		web_sForm:self.data.sForm
  	})
  },

  submit(){
    const self = this;
    wx.showLoading(); 
    if(api.checkComplete(self.data.sForm)){
         
      wx.setStorageSync('login',self.data.sForm);
    }else{
      api.showToast('请输入账号密码','none')
    }
    const callback = (res)=>{
      if(res){       
          wx.setStorageSync('storeInfo',res.data.info); 
          wx.redirectTo({
            url: '/pages/userStore/userStore'
          })
          api.showToast('登陆成功','none')  
      }else{
          wx.hideLoading();
         api.showToast('用户不存在','none')
      }
    }
    token.getToken(callback);
  },


  bindInputChange(e){
    const self = this;
    api.fillChange(e,self,'sForm');
    self.setData({
      web_sForm:self.data.sForm,
    });
  },

	changeType(){
		const self = this;	
		if(self.data.type=='password'){
			self.data.type='text'
		}else if(self.data.type=='text'){
			self.data.type='password'
		}
		self.setData({
			web_type:self.data.type
		})
		
	},



  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },


}) 

  