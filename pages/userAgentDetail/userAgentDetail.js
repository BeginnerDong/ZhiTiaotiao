import {Api} from '../../utils/api.js';
var api = new Api();

import {Token} from '../../utils/token.js';
var token = new Token();

Page({

  data: {
		isFirstLoadAllStandard:['getMainData'],
		getAfter:{}
  },

  onLoad(options) {
  	const self = this;
  	api.commonInit(self);
  	self.data.user_no = options.user_no;
		if(options.type){
			self.data.getAfter = {
				distribution:{
					tableName:'Distribution',
					middleKey:'user_no',
					key:'child_no',
					searchItem:{
						status:1,
						level:1
					},
					condition:'='
				},
				userInfo:{
					tableName:'UserInfo',
					middleKey:['distribution','0','parent_no'],
					key:'user_no',
					searchItem:{
						status:1
					},
					condition:'='
				}
			}
			self.setData({
				web_type:options.type
			})
			console.log('options.type',options.type)
		};
  	self.getMainData();
  	
  },
  
  getMainData() {
  	const self = this;
  	const postData = {};
  	postData.tokenFuncName = 'getAgentToken';
  	postData.searchItem = {
  		user_no: self.data.user_no,
  	};
		postData.getAfter = api.cloneForm(self.data.getAfter);
  	const callback = (res) => {
  		if (res.info.data.length > 0) {
  			self.data.mainData = res.info.data[0];
  		};
  		self.setData({
  			web_mainData: self.data.mainData
  		});
  		api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
  	};
  	api.shopInfoGet(postData, callback);
  },
	
  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },
  
})

  