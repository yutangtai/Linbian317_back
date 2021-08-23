import express from 'express'
import auth from '../middleware/auth.js'

import {
  addData,
  getData,
  editData
} from '../controllers/indexNumData.js'

const router = express.Router()

router.post('/', auth, addData)
router.get('/', getData)
router.patch('/:id', auth, editData)

export default router
