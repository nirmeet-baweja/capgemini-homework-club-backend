import express from 'express'
import { getAdmin } from './controllers'

const router = express.Router()
// localhost:3001/admins
router.get('/:userId', getAdmin)

export default router
