# 支条条项目开发文档

### 目录

- 项目说明
- 功能概述
- 数据对照表


---
**1\. 项目概况**

&emsp;&emsp;1. 小程序项目，主要用户分为平台、城市运营商、商家、普通用户
&emsp;&emsp;2. 项目特殊需求：接入第三方支付实现分账与提现功能;按时间段结算奖励，并排名

---
**2\. 功能说明**
1.代理、店铺与用户的关系记录distribution表,其中代理与代理level=1,代理与店铺level=2,店铺与会员lelve=1,店铺与会员的关系在用户首次消费时记录,代理与代理、代理与店铺的关系,在cms端审核通过时记录;

---
**3\. 数据对照表**

通用字段说明

| 字段 | 类型 | 说明 |
| ------    | ------  | ------ | 
| id | int(11)| 主键：该数据ID|
| listorder | int(11) |自定义排序 |
| create_time | int(11) |创建时间 |
| update_time | int(11) |更新时间 |
| delete_time | bigint(13) |删除时间 |
| thirdapp_id | int(11) |关联thirdapp |
| user_no | varchar(255) |关联创建人user_no |
| user_type | tinyint(2) | 用户类型:1.平台管理员;2.员工;3.用户 |
| status | tinyint(2) |状态:1正常；-1删除 |



user表

| 字段 | 类型 | 说明 |
| ------    | ------  | ------ | 
| nickname | varchar(255) | 微信昵称 |
| openid | varchar(255)| 微信openid |
| headImgUrl | varchar(9999) |  微信头像 |
| primary_scope | int(255) | 权限级别：90平台管理员;60超级管理员;30管理员;10用户 |
| user_no | varchar(255) | 用户编号 |



user_info表
| 字段 | 类型 | 说明 |
| ------    | ------  | ------ | 
| name | varchar(255) | 姓名 |
| phone | varchar(255) | 手机号 |
| province | varchar(50) | 省份 |
| city | varchar(50) | 城市 |
| address | varchar(255) | 详细地址 |
| email | varchar(255) | 邮箱 |
| level | varchar(30) | 等级：1.代理,2.门店 |
| idCard | varchar(60) | 证件号码 |
| bank | varchar(60) | 开户行 |
| bank_no | varchar(60) | 银行代号 |
| card_no | varchar(60) | 银行卡号 |
| card_prov | varchar(50) | 银行卡省份 |
| card_area | varchar(50) | 银行卡城市 |
| check_status | tinyint(2) | 汇付天下注册：1.待确认,2.通过,3.未通过 |
| user_cust_id | varchar(255) | 汇付天下用户客户号 |
| acct_id | varchar(255) | 汇付天下子账户号 |
| dc_flag | tinyint(2) | 0.借记卡1.贷记卡 |
| cash_bind_card_id | varchar(60) | 提现卡ID |
| balance | decimal(10, 2) | 货款 |
| score | decimal(10, 2) | 支条条 |
| reward | decimal(10, 2) | 联盟金 |
| benifit | decimal(10, 2) | 佣金 |
| license_img | varchar(999) | 营业执照照片 |
| id_img | varchar(999) | 身份证照片 |
| shop_num | int(11) | 店铺数量 |
| auth_num | int(11) | 授权数量 |
| mem_num | int(11) | 会员数量 |
| bill_img | text | 打款账单 |



flow_log表

| 字段 | 类型 | 说明 |
| ------    |  :------:  | ------  |
| type | int(11) | 1.微信支付,2.货款,3.支条条,4.联盟金(每天5点结算),5.佣金 |
| count | decimal(10, 2) | 金额 |
| behavior | tinyint(2) | 1.未结算,2.已结算 |
| shop_no | varchar(255) | 店家no |
| consumer_no | varchar(255) | 消费者no |



distribution表

| 字段 | 类型 | 说明 |
| ------    | ------  | ------ | 
| level | tinyint(2) | 层级 |
| parent_no | varchar(255) | 父级 |
| child_no | varchar(255) | 子级 |
| type | tinyint(2) | 1.店铺2.会员3.代理 |



shop_info表

| 字段 | 类型 | 说明 |
| ------    | ------  | ------ | 
| name | varchar(100) | 店铺名称 |
| owner | varchar(100) | 负责人姓名 |
| menu_id | int(11) | 门店类别 |
| content | text | 门店详情 |
| mainImg | varchar(999) | 店铺主图 |
| bannerImg | varchar(9999) | 店铺环境图 |
| qrImg | varchar(999) | 店铺收款码 |
| view_count | int(11) | 浏览量 |
| favor_count | int(11) | 点赞量 |
| follow_count | int(11) | 关注量 |
| phone | varchar(100) | 联系电话 |
| csphone | varchar(100) | 客服电话 |
| keywords | varchar(255) | 主营商品 |
| description | varchar(255) | 营业时间 |
| address | varchar(255) | 店铺地址 |
| longitude | varchar(255) | 经度 |
| latitude | varchar(255) | 纬度 |



article表（图文信息：包括简希简介、申请协议）

| 字段 | 类型 | 说明 |
| ------    | ------  | ------ | 
| name | varchar(100) | 姓名 |
| phone | varchar(20) | 手机号 |
| province | varchar(20) | 省 |
| city | varchar(20) | 市 |
| country | varchar(20) | 区 |
| detail | varchar(255) | 详细地址 |
| longitude | varchar(255) | 经度 |
| latitude | varchar(255) | 纬度 |
| isdefault | tinyint(2) | 1.默认,0.非默认 |



label表

| 字段 | 类型 | 说明 |
| ------    | ------  | ------  | 
| title | varchar(40) | 菜单名称 |
| description| 
| 字段 | 类型 | 说明 |
| ------    |  :------:  | ------  | 
| title | varchar(100) | 文章标题 |
| small_title | varchar(100) | 文章副标题 |
| menu_id | int(11) | 文章类别 |
| content | text | 文章内容 |
| mainImg | varchar(9999) | 文章主图 |



product表

| 字段 | 类型 | 说明 |
| ------    |  :------:  | ------  | 
| title | varchar(255) | 商品名称 |
| content | text | 商品详情 |
| mainImg | text | 商品主图 |
| bannerImg | text | 商品轮播图 |
| price | decimal(10, 2) | 商品价格 |
| score | decimal(10, 2) | 知条价格 |
| stock | int(255) | 商品库存 |



order表

| 字段 | 类型 | 说明 |
| ------    |  :------:  | ------  | 
| order_no | varchar(255) | 订单号 |
| pay | varchar(255) | pay方式详情 |
| price | decimal(10, 2) | 订单金额 |
| snap_address | varchar(999) | 地址快照 |
| pay_status | tinyint(2) | 0.未支付;1.已支付;3,已退款 |
| type | tinyint(2) | 1.普通商品 |
| prepay_id | varchar(255) | 订单微信支付的预订单id |
| wx_prepay_info | varchar(999) | 储存微信预支付信息，再次调起支付使用 |
| order_step | tinyint(2) | 0.正常下单,3.完结 |
| transport_status | tinyint(2) | 0.正常下单,3.完结 |
| transaction_id | varchar(255) | 微信交易id |
| refund_no | varchar(255) | 退单号 |
| pay_no | varchar(255) | 支付单号 |



message表

| 字段 | 类型 | 说明 |
| ------    |  :------:  | ------  | 
| title | varchar(100) | 题目标题 |
| type | tinyint(2) | 1.公告消息,2.奖励通知,3.交易通知,4.知条过期提醒,5.意见反馈 |
| description | varchar(255) | 通知内容 |
| behavior | tinyint(2) | 1.未读2.已读 |
| phone | varchar(225) | 联系电话 |
| mainImg | varchar(999) | 主图 |



log表(type=4)点赞

| 字段 | 类型 | 说明 |
| ------    |  :------:  | ------  | 
| relation_id | varchar(100) | 关联店铺shop_info |
| user_no | varchar(255) | 点赞用户no |



log表(type=5)关注

| 字段 | 类型 | 说明 |
| ------    |  :------:  | ------  | 
| relation_id | varchar(100) | 关联店铺shop_info |
| user_no | varchar(255) | 关注用户no |



log表(type=6)支条条操作记录

| 字段 | 类型 | 说明 |
| ------    |  :------:  | ------  | 
| title | varchar(255) | 回复提示信息 |
| result | varchar(255) | 回复状态码 |
| content | text | 提交的信息 |
| passage | varchar(999) | 返回的信息 |
| order_no | varchar(100) | 关联订单 |
| request_no | varchar(100) | 请求no |



log表(type=7)平台消息阅读记录

| 字段 | 类型 | 说明 |
| ------    |  :------:  | ------  | 
| relation_id | varchar(100) | 关联message |
| user_no | varchar(255) | 用户no |




area表
| 字段 | 类型 | 说明 |
| ------    |  :------:  | ------  | 
| city | varchar(100) | 城市 |
| city_no | varchar(100) | 城市编码 |
| province | varchar(100) | 省份 |
| province_no | varchar(100) | 省份编码 |
| type | tinyint(2) | 1.省份2.城市 |



third_app表
| 字段 | 类型 | 说明 |
| ------  |  :------:  | ------ | 
可编辑设置字段：
微信支付奖励知条数、联盟金积累比例、纸条累计比例、代理获得奖励比例、代理的代理获得奖励比例



rank表（排行榜）
| 字段 | 类型 | 说明 |
| ------  |  :------:  | ------ | 
| rank | int(11) | 名次 |
| reward | decimal(10, 2) | 奖励知条 |
| consume | decimal(10, 2) | 消费金额 |
---