import {Api} from '../../utils/api.js';
var api = new Api();

import {Token} from '../../utils/token.js';
var token = new Token();

Page({

  data: {
				currentId:1,
				is_rule:false
  },
	 rule(e){
	const self=this;
	self.data.is_rule=!self.data.is_rule;
	self.setData({
		is_rule:self.data.is_rule
	})
	},
	
	tab(e){
	 this.setData({
	    currentId:e.currentTarget.dataset.id
	  })
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
  
})

  