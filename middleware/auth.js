import jwt from 'jsonwebtoken'
import users from '../models/users.js'

export default async (req, res, next) => {
  try {
    const token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : ''
    if (token.length > 0) {
      const decoded = jwt.decode(token)
      const _id = decoded._id
      // console.log(decoded)
      // console.log(_id)
      req.user = await users.findOne({ _id, tokens: token })
      req.token = token
      if (req.user !== null) {
        if (req.baseURL === '/users' && req.path === '/extend') {
          next()
        } else {
          jwt.verify(token, process.env.SECRET)
          next()
        }
      } else {
        console.log('req.user 是 null')
        throw new Error()
      }
    } else {
      console.log('沒有 token')
      throw new Error()
    }
  } catch (error) {
    console.log('結論 error:' + error)
    return res.status(401).send({ success: false, message: '驗證錯誤' })
  }
}
