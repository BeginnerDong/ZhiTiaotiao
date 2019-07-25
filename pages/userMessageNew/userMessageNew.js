import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
	isFirstLoadAllStandard:['getMainData']
  },
  onLoad(options){
	const self = this;
	api.commonInit(self);
	self.data.id = options.id;
	self.getMainData()
  },
  
  getMainData() {
  	const self = this;
  	const postData = {};
  	postData.tokenFuncName = 'getProjectToken';
  	postData.searchItem = {
		id:self.data.id
	};
  	postData.searchItem.user_no = ['in',[wx.getStorageSync('info').user_no,'U910872296194660']];
  	postData.searchItem.type = ['in',[1,2,3,4,5]];
  	postData.getAfter = {
  		log: {
  			tableName: 'Log',
  			middleKey: 'id',
  			key: 'relation_id',
  			searchItem: {
  				status: 1,
  				type:6
  			},
  			condition: '=',
  		}
  	};
  	const callback = (res) => {
  		if (res.info.data.length > 0) {
  			self.data.mainData = res.info.data[0];
  			self.data.mainData.content = api.wxParseReturn(res.info.data[0].content).nodes;
			if(self.data.mainData.log.length==0){
				self.addLog()
			}
  		}
  		self.setData({
  			web_mainData: self.data.mainData
  		});
  		api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
  	};
  	api.messageGet(postData, callback);
  },
  
  addLog() {
  	const self = this;
  	const postData = {};
  	postData.data = {
  		type:6,
  		title: '阅读记录',
  		relation_id: self.data.mainData.id,
  		user_no: wx.getStorageSync('info').user_no,
  	};
  	postData.tokenFuncName = 'getProjectToken';
  	const callback = (res) => {
  		if (res.solely_code == 100000) {
  			console.log('已阅读')
  
  		} else {
  			api.showToast(res.msg, 'none', 1000)
  		};
  	};
  	api.logAdd(postData, callback);
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

  