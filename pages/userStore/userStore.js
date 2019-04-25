import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();

Page({
  data: {
 
  },

  onLoad(options){

  },
	
	loginOff(){
		const self = this;
		wx.removeStorageSync('login');
		wx.removeStorageSync('storeToken');
		wx.removeStorageSync('storeInfo');
		api.pathTo('/pages/userStoreLogin/userStoreLogin','redi');
	},
 
  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  intoPathRedi(e){
    const self = this;
    wx.navigateBack({
      delta:1
    })
  },
  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 
 
})

  