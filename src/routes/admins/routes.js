import express from 'express'
import {
  getUsers,
  getAdmins,
  updateAdminRole,
  getVolunteers,
  updateVolunteerRole,
  getStudents,
  getSignedUpClasses,
  cancelClassSignUp,
  createNewClass,
  getClassDetails,
  updateClassAttendance,
  getAttendance,
  createNewCohort,
  createNewSkill,
} from './controllers'

const router = express.Router()
// localhost:3001/admins
router.get('/users', getUsers)
router.get('/admins', getAdmins)
router.put('/admins/:adminId', updateAdminRole)
// no data is expected to be sent in req.body
router.get('/volunteers', getVolunteers)
router.put('/volunteers/:volunteerId', updateVolunteerRole)
// no data is expected to be sent in req.body
router.get('/students', getStudents)
router.get('/class-sign-ups', getSignedUpClasses)
router.put('/class-sign-ups/cancel/:classId', cancelClassSignUp)
// no data is expected to be sent in req.body
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
router.put('/class-details/:classId', updateClassAttendance)
/* req.body should have
[
  { userId: 41, isPresent: false },
  { userId: 44, isPresent: false },
  ...
]
*/
router.get('/attendance', getAttendance)
router.post('/cohorts', createNewCohort)
/* req.body should contain
  {
    cohortName: 'London Class 8',
  }
*/
router.post('/skills', createNewSkill)
/* req.body should contain
  {
    skillName: 'New skill',
  }
*/

export default router
