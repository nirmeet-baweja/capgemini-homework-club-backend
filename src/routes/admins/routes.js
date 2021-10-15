import express from 'express'
import {
  // getAdmin,
  getUsers,
  getVolunteers,
  getStudents,
  // getClasses,
  getClassDetails,
} from './controllers'

const router = express.Router()
// localhost:3001/admins
router.get('/users', getUsers)
router.get('/volunteers', getVolunteers)
router.get('/students', getStudents)
router.get('/class-details/:classId', getClassDetails)

export default router
