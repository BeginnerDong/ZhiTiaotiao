//logs.js
import {Api} from '../../utils/api.js';
var api = new Api();

import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
    currentId:0,
    is_show:false,
    is_peice:false,
  },

  onLoad(options){
    const self = this;
   
  },
  payment(e){
    const self = this;
    self.data.is_show = true;
    self.setData({
      is_show:self.data.is_show
    })
  }, 
  confirm(e){
    const self = this;
    self.data.is_peice = true;
    self.data.is_show = false;
    self.setData({
      is_peice:self.data.is_peice,
      is_show:self.data.is_show
    })
  },
  cancle(e){
    const self = this;
    self.data.is_show = false;
    self.setData({
      is_show:self.data.is_show
    })
  },
  close(e){
    const self = this;
    self.data.is_peice = false;
    self.data.is_show = false;
    self.setData({
      is_show:self.data.is_show,
      is_peice:self.data.is_peice,
    })
  },
  choose_payment(e){
    const self = this;
    self.data.currentId = !self.data.currentId;
    self.setData({
      currentId:self.data.currentId
    })
  },
  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  intoPathBack(e){
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

  