import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
  data: {
    background: ['/images/banner.jpg', '/images/banner.jpg', '/images/banner.jpg'],
    indicatorDots: false,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
  },
  //事件处理函数
 
  onLoad(options) {
    const self = this;

  },
  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },
  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 
})

  