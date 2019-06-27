import {Api} from '../../utils/api.js';
var api = new Api();

import {Token} from '../../utils/token.js';
var token = new Token();
 

 
Page({

  data: {
    submitData:{
  
      password_new:'',
      password_new_copy:'', 
    },

		buttonCanClick:true
  },




  onLoad(){
    const self = this;
		self.setData({
			web_buttonCanClick:self.data.buttonCanClick
		})
  },


  passwordUpdate(){
    const self = this;
      const postData = {};
      postData.tokenFuncName = 'getProjectToken';
			
      postData.data = {
        password:self.data.submitData.password_new,
      }; 
      const callback = (res) => { 
        const pass = api.dealRes(res);
        if(pass){
          api.showToast('修改成功','none');
					wx.navigateBack({
						delta:1
					})
        }
      };
    api.userUpdate(postData,callback);    
  },



  changeBind(e){
    const self = this;
    api.fillChange(e,self,'submitData');
    if(self.data.submitData.password_new&&self.data.submitData.password_new_copy){
      if(self.data.submitData.password_new!=self.data.submitData.password_new_copy){
        api.showToast('新密码不一致','none'); 
        self.data.submitData.password_new_copy = ''   
      };  
    }; 
      self.setData({
        web_submitData:self.data.submitData
      });
  },



  submit(){
    const self = this;
		api.buttonCanClick(self);
    setTimeout(function(){
      const pass = api.checkComplete(self.data.submitData);
      if(pass){
        
        self.passwordUpdate();      
      }else{
				api.buttonCanClick(self,true);
        api.showToast('请补全信息','none');
      }; 
    },100);
  },
  

})    