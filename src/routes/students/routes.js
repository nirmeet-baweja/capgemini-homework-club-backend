import express from 'express'
import {
  getSignedUpClasses,
  // signUpForClass,
  cancelClassSignUp,
} from './controllers'

const router = express.Router()

// localhost:3001/students
router.get('/class-sign-ups', getSignedUpClasses)
router.put('/class-sign-ups/cancel/:classId', cancelClassSignUp)
// router.post('/class-sign-ups/:classId', signUpForClass)

export default router
