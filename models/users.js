import mongoose from 'mongoose'
// import md5 from 'md5'
import bcrypt from 'bcrypt'
import validator from 'validator'

const Schema = mongoose.Schema

const UserSchema = new Schema({
  role: {
    // 0 = 一般會員
    // 1 = 管理員
    type: Number,
    default: 0,
    required: [true, '無該使用者分類']
  },
  account: {
    type: String,
    minlength: [4, '帳號至少 4 個字'],
    maxlength: [20, '帳號不能超過 20 個字'],
    unique: true,
    required: [true, '帳號為必填欄位']
  },
  password: {
    type: String,
    minlength: [4, '密碼至少 4 個字'],
    maxlength: [100, '密碼不能超過 100 個字'],
    required: [true, '密碼為必填欄位']
  },
  tokens: {
    type: [String]
  },
  email: {
    type: String,
    required: [true, '信箱為必填欄位'],
    validate: {
      validator: (email) => {
        return validator.isEmail(email)
      },
      message: '信箱格式不正確'
    }
  },
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{4} - \d{3} - \d{3}/.test(v)
      },
      message: props => `${props.value} 電話格式不正確`
    },
    required: [true, '電話為必填欄位']
  },
  cart: {
    type: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'products',
          required: [true, '缺少商品 ID']
        }
      },
      {
        amount: {
          type: Number,
          required: [true, '缺少商品數量']
        }
      }
    ]
  },
  orders: {
    type: [
      {
        products: [
          {
            product: {
              type: Schema.Types.ObjectId,
              ref: 'products',
              required: [true, '缺少商品 ID']
            },
            amount: {
              type: Number,
              required: [true, '缺少商品數量']
            }
          }
        ],
        date: {
          type: Date
        },
        paid: {
          type: Boolean,
          required: [true, '是否已付款']
        },
        process: {
          type: String,
          required: [true, '批貨中或已出貨']
        }
      }
    ]
  }
}, { versionKey: false })

UserSchema.pre('save', function (next) {
  console.log('models/users.js')
  const user = this
  const myPassword = user.password
  const saltRounds = 10
  const hash = bcrypt.hashSync(myPassword, saltRounds)
  if (user.isModified('password')) {
    user.password = hash
    console.log(user.password)
  }
  next()
})

export default mongoose.model('users', UserSchema)
