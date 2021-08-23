import express from 'express'
import auth from '../middleware/auth.js'
import upload from '../middleware/upload.js'

import {
  addData,
  getData,
  editData
} from '../controllers/indexData.js'

const router = express.Router()

router.post('/', auth, upload, addData)
router.get('/', getData)
router.patch('/:id', auth, upload, editData)

export default router
