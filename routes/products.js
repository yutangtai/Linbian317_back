import express from 'express'
import auth from '../middleware/auth.js'
import upload from '../middleware/upload.js'

import {
  addProduct,
  getProduct,
  editProduct
} from '../controllers/products.js'

const router = express.Router()

router.post('/', auth, upload, addProduct)
router.get('/', getProduct)
router.patch('/:id', auth, upload, editProduct)

export default router
