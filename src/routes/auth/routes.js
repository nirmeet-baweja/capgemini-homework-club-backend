import express from 'express'
import {
  studentSignUp,
  volunteerSignUp,
  signIn,
  forgotPassword,
  resetPassword,
} from './controllers'

const router = express.Router()
// localhost:3001/auth
router.post('/student/sign-up', studentSignUp)
/* req.body should contain
  {
    "firstName": "Some",
    "lastName" : "Name",
    "email": "someemail@gmail.com",
    "password": "Aw23@poo",
    "cohortId": 5,
  }
*/
router.post('/volunteer/sign-up', volunteerSignUp)
/* req.body should contain
  {
    "firstName": "Some",
    "lastName" : "Name",
    "email": "someemail@gmail.com",
    "password": "Aw23@poo",
    "skills": [3, 6, 4]
  }
*/
router.post('/sign-in', signIn)
/* req.body should contain
  {
    "email": "some-ones@email.com",
    "password": "someValidPassword"
  }
*/
router.put('/forgot-password', forgotPassword)
/* req.body should contain
  {
    "email": "some-ones@email.com"
  }
*/
router.put('/reset-password/:token', resetPassword)
/* req.body should contain
  {
    "password": "someValidPassword"
  }
*/

export default router
