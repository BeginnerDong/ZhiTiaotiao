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
		bankData: [{
			name: '兴业银行',
			value: '03090000'
		}, {
			name: '华夏银行',
			value: '03040000'
		}, {
			name: '北京银行',
			value: '03130011'
		}, {
			name: '招商银行',
			value: '03080000'
		}, {
			name: '中国工商银行',
			value: '01020000'
		}, {
			name: '中国建设银行',
			value: '01050000'
		}, {
			name: '中国农业银行',
			value: '01030000'
		}, {
			name: '光大银行',
			value: '03030000'
		}, {
			name: '北京农村商业银行',
			value: '04020011'
		}, {
			name: '中国银行',
			value: '01040000'
		}, {
			name: '中国邮政储蓄银行',
			value: '04030000'
		}, {
			name: '南京银行',
			value: '03133201'
		}, {
			name: '杭州银行',
			value: '03133301'
		}, {
			name: '浙商银行',
			value: '03160000'
		}, {
			name: '上海银行',
			value: '03130031'
		}, {
			name: '渤海银行',
			value: '03180000'
		}, {
			name: '上海农村商业银行',
			value: '04020031'
		}, {
			name: '广东发展银行',
			value: '03060000'
		}, {
			name: '民生银行',
			value: '03050000'
		}, {
			name: '浦东发展银行',
			value: '04020031'
		}, {
			name: '平安银行',
			value: '03134402'
		}, {
			name: '浙江民泰商业银行',
			value: '03133307'
		}, {
			name: '浙江泰隆商业银行',
			value: '31330000'
		}, {
			name: '深圳发展银行',
			value: '03070000'
		}, {
			name: '中信银行',
			value: '03020000'
		}, {
			name: '交通银行',
			value: '03010000'
		}],
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
			corp_name: '',
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
			bank_acct_name: '',
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
		isFirstLoadAllStandard: ['getMainData']
	},

	onShow() {
		const self = this;
		api.commonInit(self);

		self.hfInfoGet();
		
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
				var id = url.match(imgIdReg)[1]
				console.log('id', id)
				self.data.submitData.file.push(id)
				self.setData({
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

	bindLicenseStartChange(e) {
		const self = this;
		console.log('picker发送选择改变，携带值为', e.detail.value)
		self.data.submitData.license_start_date = e.detail.value.replace('-', '');
		self.setData({
			web_licenseStart: e.detail.value
		})
	},

	bindLicenseEndChange(e) {
		const self = this;
		console.log('picker发送选择改变，携带值为', e.detail.value)
		self.data.submitData.license_end_date = e.detail.value.replace('-', '');
		self.setData({
			web_licenseEnd: e.detail.value
		})
	},

	bindCertStartChange(e) {
		const self = this;
		console.log('picker发送选择改变，携带值为', e.detail.value)
		self.data.submitData.legal_cert_start_date = e.detail.value.replace('-', '');
		self.setData({
			web_certStart: e.detail.value
		})
	},

	bindCertEndChange(e) {
		const self = this;
		console.log('picker发送选择改变，携带值为', e.detail.value)
		self.data.submitData.legal_cert_end_date = e.detail.value.replace('-', '');
		self.setData({
			web_certEnd: e.detail.value
		})
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
				if (self.data.userInfoData.check_status != 0&&self.data.hfInfoData.type==2) {
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
	

	hfInfoGet() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getStoreToken';

		const callback = (res) => {
			if (res.solely_code == 100000) {
				if (res.solely_code == 100000) {
					self.data.hfInfoData  = res.info.data[0]
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
			if (self.data.mainData[i].province_no == self.data.pArray[e.detail.value].value) {
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
