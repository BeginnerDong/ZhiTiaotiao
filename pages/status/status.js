import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
    select_data:2019-1-12,
    is_rule:false,
  },
 
  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },
  changeDate(e){
    const self = this;
    self.data.select_data = e.detail.value;
    self.setData({
      select_data:self.data.select_data
    })
  },
  rule(e){
    const self = this;
    self.data.is_rule = !self.data.is_rule
    self.setData({
      is_rule:self.data.is_rule
    })
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

  