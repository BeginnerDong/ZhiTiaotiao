import {Api} from '../../utils/api.js';
var api = new Api();

import {Token} from '../../utils/token.js';
var token = new Token();

Page({

  data: {
    index:1,
    array: ['行业一', '行业二'],
    region: ['广东省', '广州市', '海珠区'],
  },

  onShow(){
    const self = this;
    
  },
  bindInputChange(e){
    const self = this;
    api.fillChange(e,self,'sForm');
    self.setData({
      web_sForm:self.data.sForm,
    });
  },
  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value
    })
  }, 
   bindRegionChange(e) {
    this.setData({
      region: e.detail.value
    })
  }
})

  