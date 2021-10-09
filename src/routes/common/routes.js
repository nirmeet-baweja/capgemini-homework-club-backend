import express from 'express'
import {
  getRoles,
  getUsers,
  getVolunteers,
  getStudents,
  getClasses,
  getUpcomingClasses,
} from './controllers'

const router = express.Router()
// localhost:3001/data
router.get('/roles', getRoles)
router.get('/users', getUsers)
router.get('/volunteers', getVolunteers)
router.get('/students', getStudents)
router.get('/classes', getClasses)
router.get('/upcoming-classes', getUpcomingClasses)

export default router
