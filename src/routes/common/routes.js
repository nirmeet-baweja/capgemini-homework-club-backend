import express from 'express'
import { getRoles, getUpcomingClasses } from './controllers'

const router = express.Router()
// localhost:3001/data
router.get('/roles', getRoles)
router.get('/upcoming-classes', getUpcomingClasses)

export default router
