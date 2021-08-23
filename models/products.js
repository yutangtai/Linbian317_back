import mongoose from 'mongoose'

const Schema = mongoose.Schema

// 右側商品欄位
const productRightSchema = new Schema({
  // 商品名稱
  name: {
    type: String,
    required: [true, '缺少商品名稱']
  },
  // 商品價格
  price: {
    type: Number,
    min: [0, '價格最少為 0']
  },
  // 商品內容
  content: {
    type: String
  },
  // 商家資訊
  contact_name: {
    type: String
  },
  contact_phone: {
    type: String
  },
  contact_address: {
    type: String
  },
  // 超連結
  link: {
    type: String
  },
  // 影片
  video: {
    type: String
  },
  // 圖片
  image: {
    type: String,
    required: [true, '缺少商品圖片']
  },
  // 上架
  sell: {
    type: Boolean,
    default: true
  }
}, { versionKey: false })

// 左側標題欄位
const productLeftSchema = new Schema({
  // 商品大標題
  title: {
    type: String,
    required: [true, '缺少商品大標題']
  },
  // 商品概述、引言、介紹
  intro_para1: {
    type: String,
    required: [true, '缺少商品介紹']
  },
  intro_para2: {
    type: String
  },
  intro_para3: {
    type: String
  },
  // 商品保存方式
  keep: {
    type: String
  },
  // 圖片
  image: {
    type: String,
    required: [true, '缺少底部大圖']
  },
  right: [productRightSchema]
}, { versionKey: false })

// 商品分類
const productGroupsSchema = new Schema({
  tabLabels: {
    type: String,
    unique: true,
    required: [true, '缺少商品標籤']
  },
  tabNames: {
    type: String,
    unique: true,
    required: [true, '缺少商品標籤名稱']
  },
  left: [productLeftSchema]
}, { versionKey: false })
const products = mongoose.model('products', productGroupsSchema)

export default products
