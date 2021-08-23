import users from '../models/users.js'
// import md5 from 'md5'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// 註冊---------------------------->
export const register = async (req, res) => {
  // console.log('註冊啦!!!')
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '資料格式不正確' })
    return
  }
  try {
    await users.create(req.body)
    res.status(200).send({ success: true, message: '帳號註冊成功' })
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message: message })
    } else if (error.name === 'MongoError' && error.code === 11000) {
      res.status(400).send({ success: false, message: '帳號已存在' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

// 登入---------------------------->
export const login = async (req, res) => {
  // console.log('登入啦!!!')
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '資料格式不正確' })
    return
  }
  try {
    const user = await users.findOne({ account: req.body.account }, '')
    // const hashPassword = (await bcrypt.hash(req.body.password, 10)).toString()
    // console.log(hashPassword, typeof hashPassword)
    // req.body.password => 使用者輸入的密碼；user.password => 資料庫內的密碼
    // console.log(req.body.password)
    // console.log(user.password)
    // console.log(user)
    if (!user) {
      res.status(400).send({ success: false, message: '帳號不存在' })
    } else {
      const matchPassword = await bcrypt.compare(req.body.password, user.password)
      // console.log('帳號存在!!!')
      if (matchPassword) {
        console.log('controllers/users.js')
        const token = jwt.sign(
          { _id: user._id.toString() },
          process.env.SECRET,
          { expiresIn: '7 days' }
        )
        user.tokens.push(token)
        user.save({ validateBeforeSave: false })
        console.log(user)
        res.status(200).send({
          success: true,
          message: '登入成功',
          account: user.account,
          role: user.role,
          phone: user.phone,
          email: user.email,
          token
        })
      } else {
        res.status(400).send({ success: false, message: '密碼錯誤' })
      }
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 登出-------------------------------------------->
export const logout = async (req, res) => {
  try {
    // 用 filter 過濾 tokens 陣列，回傳符合 token !== req.token 的值
    req.user.tokens = req.user.tokens.filter(token => token !== req.token)
    req.user.save({ validateBeforeSave: false })
    res.status(200).send({ success: true, message: '登出成功' })
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
