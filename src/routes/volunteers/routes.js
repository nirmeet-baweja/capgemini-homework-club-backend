import express from 'express'
import { getSignedUpClasses } from './controllers'

const router = express.Router()

// localhost:3001/students
router.get('/class-sign-ups', getSignedUpClasses)

export default router
