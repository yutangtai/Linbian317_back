import products from '../models/products.js'

export const addProduct = async (req, res) => {
  console.log('addProduct')
  if (req.user.role !== 1) {
    res.status(403).send({ success: false, message: '沒有權限' })
    return
  }
  try {
    const groupName = req.body.groupNames
    console.log('groupName:' + groupName)
    const group = await products.findOne({ tabNames: groupName })
    if (group) {
      if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
        res.status(400).send({ success: false, message: '資料格式不正確' })
        return
      }
      if (group.left.length > 0) {
        console.log('右邊測試')
        group.left[0].right.push(
          {
            name: req.body.name,
            price: req.body.price,
            content: req.body.content,
            contact_name: req.body.contact_name,
            contact_phone: req.body.contact_phone,
            contact_address: req.body.contact_address,
            link: req.body.link,
            video: req.body.video,
            image: req.filepath,
            sell: req.body.toggleValue
          }
        )
        group.save({ validateBeforeSave: false })
        res.status(200).send({ success: true, message: '右側欄位新增成功', right: group.left[0].right })
        return
        // console.log('groupRight:' + group.left[0].right)
      } else {
        console.log('左邊測試')
        // 將資料丟進 left
        group.left.push(
          {
            title: req.body.title,
            intro_para1: req.body.intro_para1,
            intro_para2: req.body.intro_para2,
            intro_para3: req.body.intro_para3,
            keep: req.body.keep,
            image: req.filepath
          }
        )
        console.log(group.left)
        group.save({ validateBeforeSave: false })
        res.status(200).send({ success: true, message: '左側欄位新增成功', left: group.left })
        return
      }
    } else if (!groupName) {
      console.log('新增 tab')
      // 建立分類標籤
      const result = await products.create({
        tabLabels: req.body.tabLabel,
        tabNames: req.body.tabName
      })
      console.log(result)
      result.save({ validateBeforeSave: false })
      res.status(200).send({ success: true, message: '成功新增商品標籤', result })
      return
    }
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message: message })
    } else if (error.name === 'MongoError' && error.code === 11000) {
      res.status(400).send({ success: false, message: '標籤已存在' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const getProduct = async (req, res) => {
  try {
    console.log('getProduct')
    const result = await products.find()
    res.status(200).send({ success: true, message: '成功取得商品資訊', result })
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const editProduct = async (req, res) => {
  console.log('editProduct')
  if (req.user.role !== 1) {
    res.status(403).send({ success: false, message: '沒有權限' })
    return
  }
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
    res.status(400).send({ success: false, message: '資料格式不正確' })
    return
  }
  try {
    const groupName = req.body.groupNames
    const group = await products.findOne({ tabNames: groupName })
    const groupRights = group.left[0].right
    const filterRight = groupRights.filter(groupRight => groupRight._id.toString() === req.body._id)
    if (group.left[0] && req.body.name === undefined) {
      console.log('編輯左邊')
      const groupLeft = group.left[0]
      // console.log(groupLeft)
      groupLeft.title = req.body.title
      groupLeft.intro_para1 = req.body.intro_para1
      groupLeft.intro_para2 = req.body.intro_para2
      groupLeft.intro_para3 = req.body.intro_para3
      groupLeft.keep = req.body.keep
      if (req.filepath) groupLeft.image = req.filepath
      const updateResult = await group.save()
      res.status(200).send({ success: true, message: '成功修改左側欄位', updateResult })
      return
    } else {
      console.log('編輯右邊')
      const editRight = filterRight[0]
      console.log('editRight: ' + editRight)
      editRight.name = req.body.name
      editRight.price = req.body.price
      editRight.content = req.body.content
      editRight.contact_name = req.body.contact_name
      editRight.contact_phone = req.body.contact_phone
      editRight.contact_address = req.body.contact_address
      editRight.link = req.body.link
      editRight.video = req.body.video
      editRight.sell = req.body.toggleValue
      if (req.filepath) editRight.image = req.filepath
      const updateResult = await group.save()
      res.status(200).send({ success: true, message: '成功修改右側欄位', updateResult })
      return
    }
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
