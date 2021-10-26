import express from 'express'
import { getSignedUpClasses, cancelClassSignUp } from './controllers'

const router = express.Router()

// localhost:3001/volunteers
router.get('/class-sign-ups', getSignedUpClasses)
router.put('/class-sign-ups/cancel/:classId', cancelClassSignUp)

export default router
