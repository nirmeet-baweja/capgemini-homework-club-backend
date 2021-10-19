import express from 'express'
import {
  getUsers,
  getVolunteers,
  getStudents,
  getClassDetails,
  updateClassAttendance,
} from './controllers'

const router = express.Router()
// localhost:3001/admins
router.get('/users', getUsers)
router.get('/volunteers', getVolunteers)
router.get('/students', getStudents)
router.get('/class-details/:classId', getClassDetails)
router.post('/class-details/:classId', updateClassAttendance)

export default router
