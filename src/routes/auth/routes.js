import express from 'express'
import { studentSignUp, volunteerSignUp } from './controllers'

const router = express.Router()
// localhost:3001/auth
router.post('/student/sign-up', studentSignUp)
router.post('/volunteer/sign-up', volunteerSignUp)
// router.get("/sign-in", );

export default router
