import mongoose from 'mongoose'

const Schema = mongoose.Schema

const indexNumDataModel = new Schema({
  num_edu: {
    type: Number,
    min: [0, '格式錯誤']
  },
  num_exp: {
    type: Number,
    min: [0, '格式錯誤']
  },
  num_people: {
    type: Number,
    min: [0, '格式錯誤']
  },
  num_trash: {
    type: Number,
    min: [0, '格式錯誤']
  }
}, { versionKey: false })
const indexNumData = mongoose.model('indexNumData', indexNumDataModel)

export default indexNumData
