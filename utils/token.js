// 引用使用es6的module引入和定义
// 全局变量以g_开头
// 私有函数以_开头


class Token {
    g_params={};

    constructor(params) {
        this.g_params = params;
    }

    verify() { 
        var token = wx.getStorageSync('token');
        if (!token) {
            this.getUserInfo();
        };
    }
    
    getProjectToken(callback,postData) { 

        if((postData&&postData.refreshToken)||!wx.getStorageSync('token')){
            var params = {
                token_name:'token',
                info_name:'info',
                thirdapp_id:2
            };
            this.getUserInfo(params,callback);
        }else{
            return wx.getStorageSync('token');
        }
    }


    getStoreToken(callback,postData) { 

        if((postData&&postData.refreshToken)||!wx.getStorageSync('storeToken')){
            wx.removeStorageSync('storeToken');
            wx.removeStorageSync('storeInfo');
            wx.reLaunch({
              url: '/pages/userStoreLogin/userStoreLogin'
            });
        }else{
            return wx.getStorageSync('storeToken');
        }
    }
	
	getAgentToken(callback,postData) { 
	
	    if((postData&&postData.refreshToken)||!wx.getStorageSync('agentToken')){
	        wx.removeStorageSync('agentToken');
	        wx.removeStorageSync('agentInfo');
	        wx.reLaunch({
	          url: '/pages/userAgentLogin/userAgentLogin'
	        });
	    }else{
	        return wx.getStorageSync('agentToken');
	    }
	}


    getUserInfo(params,callback){
        var self = this;
        var wxUserInfo = {};
        if(wx.canIUse('button.open-type.getUserInfo')){
            wx.getSetting({
                success: res => {
                    if (res.authSetting['scope.userInfo']) { 
                        wx.getUserInfo({
                            success: function(res) {                  
                                wxUserInfo = res.userInfo;
                                self.getTokenFromServer(wxUserInfo,params,callback);                              
                            }
                        });
                    }else{
                        self.getTokenFromServer(wxUserInfo,params,callback);                        
                    };
                },
                fail: res=>{
                    wx.showToast({
                        title:'拉取微信失败',
                        icon:'fail',
                        duration:2000,
                        mask:true
                    })
                }
            });
        }else{
            wx.getUserInfo({
                success: function(res) {
                    wxUserInfo = res.userInfo;
                    self.getTokenFromServer(wxUserInfo,params,callback)                  
                }
            });
        };
        console.log(wxUserInfo)
    }


    getTokenFromServer(wxUserInfo,params,callback) {
        var self  = this;
        console.log('params',params);
        console.log('wxUserInfo',params);
        wx.login({
            success: function (res) {
                console.log(res)
                var postData = {};
                postData.thirdapp_id = params.thirdapp_id;  
                
                postData.code = res.code;
                if(wxUserInfo.nickName&&wxUserInfo.avatarUrl){
                    postData.nickname = wxUserInfo.nickName;
                    postData.headImgUrl = wxUserInfo.avatarUrl;
                };
                if(self.g_params&&self.g_params.parent_no){
                    postData.parent_no = self.g_params.parent_no;
                    console.log(self.g_params)
                };
                if(self.g_params&&self.g_params.relation_user){
                    postData.relation_user = self.g_params.relation_user;
                    console.log(self.g_params)
                };
                if(wx.getStorageSync('openidP')){
                    postData.openid = wx.getStorageSync('openidP');
                };
                console.log('postData',postData)
                wx.request({
                    url: 'http://106.12.155.217/test/public/index.php/api/v1/Base/ProgramToken/get',
                    method:'POST',
                    data:postData,
                    success:function(res){
                        console.log(res)
                        if(res.data&&res.data.solely_code==100000){
                            wx.setStorageSync(params.info_name,res.data.info);
                            wx.setStorageSync(params.token_name, res.data.token);
                            
                            if(callback){
                                callback && callback(res.data.token);
                            };      
                        }else{
                            wx.showToast({
                                title: '获取token失败',
                                icon: 'fail',
                                duration: 1000,
                                mask:true
                            });
                        };
                        
                        
                    }
                })
                
            }
        })
        
    }


    getToken(callback,params){

        if(wx.getStorageSync('login').login_name&&wx.getStorageSync('login').password){
            var postData = {
                login_name:wx.getStorageSync('login').login_name,
                password:wx.getStorageSync('login').password,
            }
            wx.request({
                url: 'http://106.12.155.217/test/public/index.php/api/v1/Func/Common/loginByUp',
                method:'POST',
                data:postData,
                success:function(res){
                    console.log(res)
                    if(res.data&&res.data.token){
						
                        wx.setStorageSync('storeToken', res.data.token);
                        var login = wx.getStorageSync('login');   
                        wx.setStorageSync('login',login);
                        if(params&&callback){  
                            params.data.token = res.data.token;
                             
                            callback && callback(params);
                        }else if(callback){
                            callback && callback(res);
                        };

                        
                    }else{
                        setTimeout(function(){
                            wx.showToast({
                                title: res.data.msg,
                                icon: 'fail',
                                duration: 1000,
                                mask:true
                            });
                        },500);

                       
                        wx.removeStorageSync('threeToken');
                        wx.removeStorageSync('login');

                    }
                    
                    
                }
            })
        }else{
            wx.redirectTo({
              url: '/pages/Index/index'
            });
        };
        

    }
	
	getTokenA(callback,params){
	
	    if(wx.getStorageSync('login').login_name&&wx.getStorageSync('login').password){
	        var postData = {
	            login_name:wx.getStorageSync('login').login_name,
	            password:wx.getStorageSync('login').password,
	        }
	        wx.request({
	            url: 'http://106.12.155.217/test/public/index.php/api/v1/Func/Common/loginByUp',
	            method:'POST',
	            data:postData,
	            success:function(res){
	                console.log(res)
	                if(res.data&&res.data.token){
						
	                    wx.setStorageSync('agentToken', res.data.token);
	                    var login = wx.getStorageSync('login');   
	                    wx.setStorageSync('login',login);
	                    if(params&&callback){  
	                        params.data.token = res.data.token;
	                         
	                        callback && callback(params);
	                    }else if(callback){
	                        callback && callback(res);
	                    };
	
	                    
	                }else{
	                    setTimeout(function(){
	                        wx.showToast({
	                            title: res.data.msg,
	                            icon: 'fail',
	                            duration: 1000,
	                            mask:true
	                        });
	                    },500);
	
	                   
	                    wx.removeStorageSync('threeToken');
	                    wx.removeStorageSync('login');
	
	                }
	                
	                
	            }
	        })
	    }else{
	        wx.redirectTo({
	          url: '/pages/Index/index'
	        });
	    };
	    
	
	}
}

export {Token};