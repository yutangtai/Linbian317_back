import mongoose from 'mongoose'

const Schema = mongoose.Schema

const indexDataModel = new Schema({
  image: {
    type: String
  },
  link: {
    type: String
  },
  show: {
    type: Boolean,
    default: true
  },
  time: {
    type: Array
  }
}, { versionKey: false })
const indexData = mongoose.model('indexData', indexDataModel)

export default indexData
