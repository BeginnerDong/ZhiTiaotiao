import {
	Api
} from '../../utils/api.js';
var api = new Api();

import {
	Token
} from '../../utils/token.js';
var token = new Token();

Page({

	data: {
		fileData: [{
				name: '营业执照注册号',
				value: '00'
			}, {
				name: '组织结构代码证',
				value: '01'
			}, {
				name: '税务登记证号',
				value: '02'
			}, {
				name: '法人证件',
				value: '03'
			}, {
				name: '开户银行许可证',
				value: '04'
			},
			{
				name: '统一社会信用代码',
				value: '05'
			}, {
				name: '开户电子协议',
				value: '08'
			}, {
				name: '法人证件反面',
				value: '09'
			},{
				name: '经营照片',
				value: '10'
			},{
				name: '经营照片（地址照片）',
				value: '11'
			},{
				name: '经营照片（门面照片）',
				value: '12'
			},{
				name: '其他',
				value: '99'
			},{
				name: '经办人证件',
				value: '15'
			}
		],
		bankData: [],
		occupationData: [{
				name: '国家机关、 党群机关、 企事业单位负责人',
				value: '01'
			}, {
				name: '金融业从业人员',
				value: '02'
			}, {
				name: '房地产业从业人员',
				value: '03'
			}, {
				name: '商贸从业人员',
				value: '04'
			}, {
				name: '自由职业者',
				value: '05'
			},
			{
				name: '科教文从业人员',
				value: '06'
			}, {
				name: '制造业从业人员',
				value: '07'
			}, {
				name: '卫生行业从业人员',
				value: '08'
			}, {
				name: 'IT业从业人员',
				value: '09'
			}, {
				name: '农林牧渔劳动者',
				value: '10'
			},
			{
				name: '生产工作、 运输工作和部分体力劳动者',
				value: '11'
			}, {
				name: '退休人员',
				value: '12'
			}, {
				name: '不便分类的其他劳动者',
				value: '13'
			}
		],
		certData: [{
				name: '身份证',
				value: '01020100'
			}, {
				name: '护照',
				value: '01020101'
			}, {
				name: '军官证',
				value: '01020102'
			}, {
				name: '士兵证',
				value: '01020103'
			}, {
				name: '回乡证',
				value: '01020104'
			},
			{
				name: '警官证',
				value: '01020105'
			}, {
				name: '台胞证',
				value: '01020106'
			}, {
				name: '其他',
				value: '01020107'
			}
		],
		submitData: {
			type: 2,
			bank_id: '',
			address: '',
			corp_license_type: '',
			
			business_code: '',
			license_start_date: '',
			license_end_date: '',
			legal_name: '',
			legal_cert_type: '',
			legal_cert_id: '',
			legal_cert_start_date: '',
			legal_cert_end_date: '',
			legal_mobile: '',
			contact_name: '',
			contact_mobile: '',
			contact_email: '',
			business_scope:'',
			bank_acct_no: '',
			bank_branch: '',
			bank_prov: '',
			bank_area: '',
			user_name: '',
			solo_business_address: '',
			solo_reg_address: '',
			solo_fixed_telephone: '',
			occupation: '',
			file:[],
		},
		attach_type: '',
		pArray: [],
		cArray: [],
		mainData: [],
		comCertType: [{
			name: '普通营业执照企业',
			value: '01030100'
		}, {
			name: '三证合一企业',
			value: '01030101'
		}],
		isFirstLoadAllStandard: ['getMainData'],
		img:[
			{url:'',id:''},
			{url:'',id:''},
			{url:'',id:''},
			{url:'',id:''},
			{url:'',id:''},
			{url:'',id:''}
		],
		show:false
			
		
	},
	
	onLoad() {
		const self = this;
		api.commonInit(self);
		self.setData({
			web_show:self.data.show,
			web_img:self.data.img,
		});
		
		self.hfInfoGet();
		self.getBankData()
	},
	

	/* onShow() {
		const self = this;
		api.commonInit(self);

		self.hfInfoGet();
		
	}, */
	
	getBankData(){
		const self = this;
		const postData = {};
		postData.searchItem = {
			thirdapp_id: 2,
		};
		postData.getBefore = {
			caseData: {
				tableName: 'Label',
				searchItem: {
					title: ['in', ['个人取现银行列表']],
				},
				middleKey: 'parentid',
				key: 'id',
				condition: 'in',
			},
		};
		postData.order = {
			listorder:'desc'
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				for (var i = 0; i < res.info.data.length; i++) {
					self.data.bankData.push({name:res.info.data[i].title,value:res.info.data[i].description})
				}
			}
			self.setData({
				bankData: self.data.bankData,
			});
			
			console.log('self.data.bankData',self.data.bankData)
		};
		api.labelGet(postData, callback);
	},

	upLoadImg(e) {
		const self = this;
		var type = api.getDataSet(e,'type');
		console.log('type',type)
		wx.showLoading({
			mask: true,
			title: '图片上传中',
		});
		const callback = (res) => {
			console.log('res', res)
			if (res.solely_code == 100000) {
				var url = res.info.url;
				var imgIdReg = /id(\S*)\./i;
				var id = url.match(imgIdReg)[1];
				console.log('id', id)
				self.data.submitData.file.push(id);
				if(type=='00'){
					self.data.img[0].url = url,
					self.data.img[0].id = id
				}else if(type=='01'){
					self.data.img[1].url = url,
					self.data.img[1].id = id
				}else if(type=='02'){
					self.data.img[2].url = url,
					self.data.img[2].id = id
				}else if(type=='03'){
					self.data.img[3].url = url,
					self.data.img[3].id = id
				}else if(type=='09'){
					self.data.img[4].url = url,
					self.data.img[4].id = id
				}else if(type=='99'){
					self.data.img[5].url = url,
					self.data.img[5].id = id
				}
				self.setData({
					web_img:self.data.img,
					web_submitData: self.data.submitData
				});
				wx.hideLoading()
			} else {
				api.showToast('网络故障', 'none')
			}
		};
		wx.chooseImage({
			count: 1,
			success: function(res) {
				console.log(res);
				var tempFilePaths = res.tempFilePaths;
				console.log(callback)
				api.uploadFile(tempFilePaths[0], 'file', {
					tokenFuncName: 'getStoreToken',
					attach_type: type,
					type:'image'
				}, callback)
			},
			fail: function(err) {
				wx.hideLoading();
			},
			
		})
		console.log(self.data.submitData.file)
	},
	
	previewImg(e) {
		const self = this;
		var index = api.getDataSet(e,'index');
		var urlArray = [];
		urlArray.push(self.data.img[index].url)
		console.log(index)
		console.log('self.data.img',self.data.img)
		wx.previewImage({
			current: self.data.img[index].url,
			urls: urlArray,
			success: function(res) {},
			fail: function(res) {},
			complete: function(res) {},
		})
	},
	
	deleteImg(e){
		const self = this;
		var index = api.getDataSet(e,'index');
		var id = api.getDataSet(e,'id');
		var position = self.data.submitData.file.indexOf(id);
		if (position >= 0) {
			self.data.submitData.file.splice(position, 1);
		};
		self.data.img[index].url = '',
		self.data.img[index].id = '',
		self.setData({
			web_submitData:self.data.submitData,
			web_img:self.data.img
		})
		console.log(self.data.submitData)
	},

	

	getMainData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			thirdapp_id: 2
		};
		postData.order = {
			id: 'asc'
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data);
				for (var i = 0; i < self.data.mainData.length; i++) {
					if (api.findItemInArray(self.data.pArray, 'name', self.data.mainData[i].province) == false) {
						self.data.pArray.push({
							name: self.data.mainData[i].province,
							value: self.data.mainData[i].province_no
						})
					};

				}
			}
			self.data.show = true;
			
			self.setData({
				web_show:self.data.show,
				web_pArray: self.data.pArray,
				web_mainData: self.data.mainData
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		}; 
		api.areaGet(postData, callback);
	},
	
	userInfoGet() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getStoreToken';
		postData.searchItem = {
			user_no:wx.getStorageSync('storeInfo').user_no
		};
		const callback = (res) => {
			if (res.solely_code == 100000) {
				self.data.userInfoData = res.info.data[0];
				if (self.data.userInfoData.check_status != 0&&self.data.userInfoData.check_status != 3&&self.data.hfInfoData.type==2) {
					wx.redirectTo({
						url:'/pages/userRegisterInforb/userRegisterInforb'
					})
				}else{
					self.getMainData();
				
				}
			};
		};
		api.userInfoGet(postData, callback);
	},
	
	submit() {
		const self = this;
		api.buttonCanClick(self);
		var phone = self.data.submitData.phone;
		const pass = api.checkComplete(self.data.submitData);
		console.log('pass', pass)
		if (pass) {
			 
				self.hfInfoUpdate();
			
		} else {
			api.buttonCanClick(self, true);
			api.showToast('请补全信息', 'none');
		};
	},

	hfInfoGet() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getStoreToken';

		const callback = (res) => {
			if (res.solely_code == 100000) {
				if (res.solely_code == 100000) {
					self.data.hfInfoData  = res.info.data[0];
					self.data.submitData.address = self.data.hfInfoData.address;
					
					self.data.submitData.business_code = self.data.hfInfoData.business_code;
					self.data.submitData.license_start_date = self.data.hfInfoData.license_start_date;
					self.data.submitData.license_end_date = self.data.hfInfoData.license_end_date;
					self.data.submitData.legal_name = self.data.hfInfoData.legal_name;
					self.data.submitData.legal_cert_id = self.data.hfInfoData.legal_cert_id;
					self.data.submitData.legal_cert_start_date = self.data.hfInfoData.legal_cert_start_date;
					self.data.submitData.legal_cert_end_date = self.data.hfInfoData.legal_cert_end_date;
					self.data.submitData.legal_mobile = self.data.hfInfoData.legal_mobile;
					self.data.submitData.contact_name = self.data.hfInfoData.contact_name;
					self.data.submitData.contact_mobile = self.data.hfInfoData.contact_mobile;
					self.data.submitData.contact_email = self.data.hfInfoData.contact_email;
					self.data.submitData.bank_acct_no = self.data.hfInfoData.bank_acct_no;
					self.data.submitData.user_name = self.data.hfInfoData.user_name;
					self.data.submitData.solo_business_address = self.data.hfInfoData.solo_business_address;
					self.data.submitData.solo_reg_address = self.data.hfInfoData.solo_reg_address;
					self.data.submitData.solo_fixed_telephone = self.data.hfInfoData.solo_fixed_telephone;
					self.data.submitData.bank_branch = self.data.hfInfoData.bank_branch;
					self.data.submitData.business_scope = self.data.hfInfoData.business_scope;
					
				
			
					self.setData({
						web_submitData:self.data.submitData
					})
					self.userInfoGet();
				};
			};
		};
		api.hfInfoGet(postData, callback);
	},


	changeBind(e) {
		const self = this;
		if (api.getDataSet(e, 'value')) {
			self.data.submitData[api.getDataSet(e, 'key')] = api.getDataSet(e, 'value');
		} else {
			api.fillChange(e, self, 'submitData');
		};
		self.setData({
			web_submitData: self.data.submitData,
		});
		console.log(self.data.submitData)
	},

	hfInfoUpdate() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getStoreToken';
		postData.data = api.cloneForm(self.data.submitData);
		postData.saveAfter = [{
			tableName: 'UserInfo',
			FuncName: 'update',
			data: {
				check_status:1,
				/* bank: self.data.submitData.bank_branch, */
				bank_id: self.data.submitData.bank_id,
				card_no: self.data.submitData.bank_acct_no,
				card_prov: self.data.submitData.bank_prov,
				card_area: self.data.submitData.bank_area,
			},
			searchItem: {
				user_no: wx.getStorageSync('storeInfo').user_no
			}
		}];
		const callback = (res) => {
			if (res.solely_code == 100000) {
				if (res.solely_code == 100000) {
					api.showToast('申请成功','none')
					wx.redirectTo({
						url:'/pages/userRegisterInforb/userRegisterInforb'
					})
				}else{
					api.showToast(res.msg,'none')
				}
			};
		};
		api.hfInfoUpdate(postData, callback);
	},

	/* bindWithdrawCard() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getStoreToken';
		const callback = (res) => {
			if (res.solely_code == 100000) {

			};
		};
		api.bindWithdrawCard(postData, callback);
	}, */


	bankChange(e) {
		const self = this;
		console.log('picker发送选择改变，携带值为', e.detail.value)
		self.data.submitData.bank_id = self.data.bankData[e.detail.value].value;
		console.log(self.data.submitData);
		self.setData({
			web_index: e.detail.value,
			web_submitData: self.data.submitData
		})
	},


	occupationChange(e) {
		const self = this;
		console.log('picker发送选择改变，携带值为', e.detail.value)
		self.data.submitData.occupation = self.data.occupationData[e.detail.value].value;
		console.log(self.data.submitData);
		self.setData({
			web_index1: e.detail.value,
			web_submitData: self.data.submitData
		})
	},

	certChange(e) {
		const self = this;
		console.log('picker发送选择改变，携带值为', e.detail.value)
		self.data.submitData.legal_cert_type = self.data.certData[e.detail.value].value;
		console.log(self.data.submitData);
		self.setData({
			web_index2: e.detail.value,
			web_submitData: self.data.submitData
		})
	},

	provinceChange(e) {
		const self = this;
		console.log('picker发送选择改变，携带值为', e.detail.value)
		self.data.cArray = [];
		self.data.submitData.bank_prov = self.data.pArray[e.detail.value].value;
		console.log(self.data.submitData);
		for (var i = 0; i < self.data.mainData.length; i++) {
			if (self.data.mainData[i].province_no == self.data.pArray[e.detail.value].value&&self.data.mainData[i].type==2) {
				if (api.findItemInArray(self.data.cArray, 'name', self.data.mainData[i].city) == false) {
					self.data.cArray.push({
						name: self.data.mainData[i].city,
						value: self.data.mainData[i].city_no
					})
				}
			}
		};
		self.setData({
			web_cArray: self.data.cArray,
			web_index3: e.detail.value,
			web_submitData: self.data.submitData
		})
	},



	cityChange(e) {
		const self = this;
		console.log(self.data.cArray)
		if (self.data.cArray.length == 0) {
			api.showToast('请先选择省份', 'none')
			return
		};
		console.log('picker发送选择改变，携带值为', e.detail.value)
		self.data.submitData.bank_area = self.data.cArray[e.detail.value].value;
		console.log(self.data.submitData);
		self.setData({
			web_index4: e.detail.value,
			web_submitData: self.data.submitData
		})
	},
	
	comCertTypeChange(e) {
		const self = this;
		console.log('picker发送选择改变，携带值为', e.detail.value)
		self.data.submitData.corp_license_type = self.data.comCertType[e.detail.value].value;
		console.log(self.data.submitData);
		self.setData({
			web_index5: e.detail.value,
			web_submitData: self.data.submitData
		})
	},
	
	attachChange(e) {
		const self = this;
		console.log('picker发送选择改变，携带值为', e.detail.value)
		self.data.attach_type = self.data.fileData[e.detail.value].value;
		console.log(self.data.submitData);
		self.setData({
			web_index4: e.detail.value,
			web_submitData: self.data.submitData
		})
	},


	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},


})
