import {Api} from '../../utils/api.js';
var api = new Api();

import {Token} from '../../utils/token.js';
var token = new Token();

Page({

  data: {
  	mainData:[],
  	searchItem:{},
  	isFirstLoadAllStandard:['getMainData'],
		showDelete:false,
		isChooseAll:false,
		idArray:[]
  },
  
  onShow(options){
  	const self  = this;
  	api.commonInit(self);
		self.setData({
			web_showDelete:self.data.showDelete
		});
  	self.getMainData(true)
  },
  
  getMainData(isNew) {
  	const self = this;
  	if(isNew){
  		api.clearPageIndex(self)
  	};
  	const postData = {};
  	postData.paginate = api.cloneForm(self.data.paginate);
  	postData.tokenFuncName = 'getStoreToken';
  	postData.searchItem = api.cloneForm(self.data.searchItem);
  	postData.order = {
  		create_time: 'desc'
  	};
  	const callback = (res) => {
  		if (res.info.data.length > 0) {
  			self.data.mainData.push.apply(self.data.mainData, res.info.data);
				for (var i = 0; i < self.data.mainData.length; i++) {
					self.data.mainData[i].isSelect = false
				};
  		}else{
  			self.data.isLoadAll=true;
  			api.showToast('没有更多了','none')
  		}
  		self.setData({
  			web_mainData: self.data.mainData
  		});
  		api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
  	};
  	api.productGet(postData, callback);
  },
	
	showDelete(){
		const self = this;
		self.data.showDelete = !self.data.showDelete;
		self.setData({
			web_showDelete:self.data.showDelete
		})
	},
	
	choose(e){
		const self = this;
		var index = api.getDataSet(e,'index');
		self.data.mainData[index].isSelect = true;
		self.setData({
			web_mainData:self.data.mainData
		})
	},
	
	 chooseAll(){
	  const self = this;
	  self.data.isChooseAll = !self.data.isChooseAll;
	  for (var i = 0; i < self.data.mainData.length; i++) {
	    self.data.mainData[i].isSelect = self.data.isChooseAll;
	  };
	  self.setData({
	    web_isChooseAll:self.data.isChooseAll,
	    web_mainData:self.data.mainData
	  });
	},
	
	deleteIndex(){
	  const self = this;
	  for(var i=0;i<self.data.mainData.length;i++){
	    if(self.data.mainData[i].isSelect){
	      self.data.idArray.push(self.data.mainData[i].id)
	    }
	  };
		const postData = {};
		postData.tokenFuncName = 'getStoreToken';
		postData.searchItem = {
			id:['in',self.data.idArray]
		};
		postData.data={
			status:-1
		};
		const callback = (res) => {
			if (res.solely_code==100000) {
				self.data.showDelete = !self.data.showDelete;
				self.setData({
					web_showDelete:self.data.showDelete
				})
			};
			self.getMainData(true)
		};
		api.productUpdate(postData, callback);
	},
  
  onReachBottom() {
  	const self = this;
  	if (!self.data.isLoadAll) {
  		self.data.paginate.currentPage++;
  		self.getMainData();
  	};
  },
	
  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },
  
})

  