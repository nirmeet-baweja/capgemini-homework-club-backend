import express from 'express'
import {
  getRoles,
  getSkills,
  getCohorts,
  getClasses,
  getUpcomingClasses,
  getPastClasses,
} from './controllers'

const router = express.Router()
// localhost:3001/data
router.get('/roles', getRoles)
router.get('/skills', getSkills)
router.get('/cohorts', getCohorts)
router.get('/classes', getClasses)
router.get('/upcoming-classes', getUpcomingClasses)
router.get('/past-classes', getPastClasses)

export default router
