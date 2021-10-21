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
router.post('/volunteer/sign-up', volunteerSignUp)
router.post('/sign-in', signIn)
router.put('/forgot-password', forgotPassword)
router.put('/reset-password/:token', resetPassword)

export default router
