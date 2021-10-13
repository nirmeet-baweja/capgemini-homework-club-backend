import express from 'express'
import {
  // getAdmin,
  getUsers,
  getVolunteers,
  getStudents,
  getClasses,
} from './controllers'

const router = express.Router()
// localhost:3001/admins
// router.get('/:userId', getAdmin)
router.get('/users', getUsers)
router.get('/volunteers', getVolunteers)
router.get('/students', getStudents)
router.get('/classes', getClasses)

export default router
