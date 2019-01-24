import {Api} from '../../utils/api.js';
var api = new Api();

import {Token} from '../../utils/token.js';
var token = new Token();

Page({

  data: {
    is_select:false,
    is_rule:false,
  },

  onShow(){
    const self = this;
    
  },
  rule(e){
    const self = this;
    self.data.is_rule = !self.data.is_rule
    self.setData({
      is_rule:self.data.is_rule
    })
  },
  select(){
    const self = this;
    self.data.is_select = !self.data.is_select;
    self.setData({
      is_select:self.data.is_select
    })
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
  
})

  