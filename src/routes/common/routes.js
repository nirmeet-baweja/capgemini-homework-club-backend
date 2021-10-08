import express from 'express'
import {
  getListOfStudyGroups,
  getRoles,
  getUsers,
  getVolunteers,
  getStudents,
  getClasses,
} from './controllers'

const router = express.Router()
// localhost:3001/data
router.get('/roles', getRoles)
router.get('/users', getUsers)
router.get('/volunteers', getVolunteers)
router.get('/students', getStudents)
router.get('/classes', getClasses)
router.get('/study-groups', getListOfStudyGroups)

export default router
