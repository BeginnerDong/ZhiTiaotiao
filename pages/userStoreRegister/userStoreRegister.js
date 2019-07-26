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
		region: ['陕西省', '西安市', '雁塔区'],
		submitData: {
			name: '',
			password: '',
			phone: '',
			email: '',
			address: '',
		
			menu_id: '',
			thirdapp_id: 2,
			longitude: '',
			latitude: ''
		},
		typeData: [],
		isFirstLoadAllStandard: ['getTypeData']
	},

	onLoad() {
		const self = this;
		api.commonInit(self);
		self.getTypeData();
		
	},


	getTypeData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			thirdapp_id: getApp().globalData.thirdapp_id
		};
		postData.getBefore = {
			caseData: {
				tableName: 'Label',
				searchItem: {
					title: ['=', ['门店类别']],
				},
				middleKey: 'parentid',
				key: 'id',
				condition: 'in',
			},
		};
		const callback = (res) => {
			console.log(1000, res);
			if (res.info.data.length > 0) {
				self.data.typeData.push.apply(self.data.typeData, res.info.data);
			}
			self.setData({
				web_typeData: self.data.typeData,
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getTypeData', self);
		};
		api.labelGet(postData, callback);
	},

	register() {
		const self = this;
		const postData = {};
		postData.data = api.cloneForm(self.data.submitData)
		const callback = (res) => {
			if (res.solely_code == 100000) {
				api.buttonCanClick(self, true);
				api.showToast('注册成功', 'none', 800);
				setTimeout(function() {
					wx.navigateBack({
						delta: 1
					})
				}, 800)
			} else {
				api.buttonCanClick(self, true);
				api.showToast(res.msg, 'none', 1000);
			};

		};
		api.registerShop(postData, callback);
	},



	submit() {
		const self = this;
		api.buttonCanClick(self);
		var phone = self.data.submitData.phone;
		const pass = api.checkComplete(self.data.submitData);
		console.log('pass', pass)
		if (pass) {
			if (phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {
				api.buttonCanClick(self, true);
				api.showToast('手机格式错误', 'none')
			} else {
				self.register();
			}
		} else {
			api.buttonCanClick(self, true);
			api.showToast('请补全信息', 'none');
		};
	},

	bindInputChange(e) {
		const self = this;
		api.fillChange(e, self, 'submitData');
		console.log('self.data.submitData',self.data.submitData)
		self.setData({
			web_submitData: self.data.submitData,
		});
	},

	bindRegionChange(e) {
		this.setData({
			region: e.detail.value
		})
	},

	bindPickerChange(e) {
		const self = this;
		console.log('picker发送选择改变，携带值为', e.detail.value)
		console.log(self.data.typeData[e.detail.value].id)
		self.data.submitData.menu_id = self.data.typeData[e.detail.value].id;
		self.setData({
			web_index: e.detail.value,
			web_submitData: self.data.submitData
		})
	},




	chooseLocation: function(e) {
		var self = this;
		wx.chooseLocation({
			success: function(res) {
				console.log('res', res)
				self.data.submitData.address = res.address,
				self.data.submitData.longitude = res.longitude,
				self.data.submitData.latitude = res.latitude,
				self.setData({
					web_submitData:self.data.submitData
				})
			},
			fail: function() {

			},
			complete: function() {
				// complete
			}
		})
	},

	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},

})
