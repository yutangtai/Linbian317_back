import indexNumData from '../models/indexNumData.js'

export const addData = async (req, res) => {
  if (req.user.role !== 1) {
    res.status(403).send({ success: false, message: '沒有權限' })
    return
  }
  try {
    const result = await indexNumData.create({
      num_edu: req.body.num_edu,
      num_exp: req.body.num_exp,
      num_people: req.body.num_people,
      num_trash: req.body.num_trash
    })
    result.save({ validateBeforeSave: false })
    res.status(200).send({ success: true, message: '成功新增資料', result })
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message: message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const getData = async (req, res) => {
  try {
    console.log('getNumData')
    const result = await indexNumData.find()
    res.status(200).send({ success: true, message: '成功取得首頁數據資訊', result })
  } catch (error) {
    console.log(error)
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '查無資料' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const editData = async (req, res) => {
  if (req.user.role !== 1) {
    res.status(403).send({ success: false, message: '沒有權限' })
    return
  }
  try {
    const data = {
      num_edu: req.body.num_edu,
      num_exp: req.body.num_exp,
      num_people: req.body.num_people,
      num_trash: req.body.num_trash
    }
    const result = await indexNumData.findByIdAndUpdate(req.params.id, data, { new: true })
    res.status(200).send({ success: true, message: '修改成功', result })
    console.log(result)
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message: message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}
