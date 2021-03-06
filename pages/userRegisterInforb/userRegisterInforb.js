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
		bankData: [],
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
			}, {
				name: '经营照片',
				value: '10'
			}, {
				name: '经营照片（地址照片）',
				value: '11'
			}, {
				name: '经营照片（门面照片）',
				value: '12'
			}, {
				name: '其他',
				value: '99'
			}, {
				name: '经办人证件',
				value: '15'
			}
		],
		submitData: {
			type: 1,
			corp_license_type: "",
			controlling_shareholder: [{
				custName: '',
				certType: '',
				certId: '',
				shareholderAddr: '',
				ratio: ''
			}],
			corp_name: '',
			license_start_date: "",
			license_end_date: "",
			corp_business_address: "",
			corp_reg_address: "",
			corp_fixed_telephone: '',
			business_scope: '',
			legal_name: '',
			legal_cert_type: "",
			legal_cert_id: '',
			legal_cert_start_date: '',
			legal_cert_end_date: '',
			legal_mobile: '',
			contact_name: '',
			contact_mobile: '',
			contact_email: '',
			bank_id: '',
			bank_acct_name: '',
			bank_acct_no: '',
			bank_branch: '',
			bank_prov: '',
			bank_area: '',

			file: []
		},
		
		
		attach_type: '',
		comCertType: [{
			name: '普通营业执照企业',
			value: '01030100'
		}, {
			name: '三证合一企业',
			value: '01030101'
		}],
		pArray: [],
		cArray: [],
		mainData: [],
		isFirstLoadAllStandard: ['getMainData']
	},

	onLoad() {
		const self = this;
		api.commonInit(self);
		self.userInfoGet();
		self.getMainData();
		self.getBankData();

	},

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
			self.hfInfoGet()
			console.log('self.data.bankData',self.data.bankData)
		};
		api.labelGet(postData, callback);
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
					if (api.findItemInArray(self.data.cArray, 'name', self.data.mainData[i].city) == false) {
						self.data.cArray.push({
							name: self.data.mainData[i].city,
							value: self.data.mainData[i].city_no
						})
					}
				}
			}
			self.setData({

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
				
			};
			self.setData({
				web_userInfoData:self.data.userInfoData
			})
		};
		api.userInfoGet(postData, callback);
	},

	hfInfoGet() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getStoreToken';
		const callback = (res) => {
			if (res.solely_code == 100000) {
				self.data.hfInfoData = res.info.data[0];
				for (var i = 0; i < self.data.comCertType.length; i++) {
					if(self.data.comCertType[i].value==self.data.hfInfoData.corp_license_type){
						self.data.hfInfoData.corp_license_type = self.data.comCertType[i].name
					}
				};
				for (var i = 0; i < self.data.certData.length; i++) {
					if(self.data.certData[i].value==self.data.hfInfoData.legal_cert_type){
						self.data.hfInfoData.legal_cert_type = self.data.certData[i].name
					}
				};
				for (var i = 0; i < self.data.bankData.length; i++) {
					if(self.data.bankData[i].value==self.data.hfInfoData.bank_id){
						self.data.hfInfoData.bank_id = self.data.bankData[i].name
					}
				};
				for (var i = 0; i < self.data.pArray.length; i++) {
					if(self.data.pArray[i].value==self.data.hfInfoData.bank_prov){
						self.data.hfInfoData.bank_prov = self.data.pArray[i].name
					}
				};
				for (var i = 0; i < self.data.cArray.length; i++) {
					if(self.data.cArray[i].value==self.data.hfInfoData.bank_area){
						self.data.hfInfoData.bank_area = self.data.cArray[i].name
					}
				}
			};
			self.setData({
				web_hfInfoData:self.data.hfInfoData
			})
		};
		api.hfInfoGet(postData, callback);
	},






	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},


})
