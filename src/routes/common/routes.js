import express from 'express'
import { getRoles, getUpcomingClasses, getPastClasses } from './controllers'

const router = express.Router()
// localhost:3001/data
router.get('/roles', getRoles)
router.get('/upcoming-classes', getUpcomingClasses)
router.get('/past-classes', getPastClasses)

export default router
