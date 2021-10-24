import express from 'express'
import {
  getUsers,
  getVolunteers,
  getStudents,
  createNewClass,
  getClassDetails,
  updateClassAttendance,
  getAttendance,
} from './controllers'

const router = express.Router()
// localhost:3001/admins
router.get('/users', getUsers)
router.get('/volunteers', getVolunteers)
router.get('/students', getStudents)
router.post('/classes', createNewClass)
/* req.body should contain
  {
    date: '2021-12-31', // yyyy-mm-dd
    comments: 'some text goes here',
    callLink: 'https://somelink',
    skills: [1, 3, 6],
  }
*/
router.get('/class-details/:classId', getClassDetails)
router.post('/class-details/:classId', updateClassAttendance)
/* req.body should have
[
  { userId: 41, isPresent: false },
  { userId: 44, isPresent: false },
  ...
]
*/
router.get('/attendance', getAttendance)

export default router
