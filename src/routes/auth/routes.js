import express from 'express'
import { studentSignUp, volunteerSignUp, signIn } from './controllers'
// import { signIn } from './services'

const router = express.Router()
// localhost:3001/auth
router.post('/student/sign-up', studentSignUp)
router.post('/volunteer/sign-up', volunteerSignUp)
router.post('/sign-in', signIn)

export default router
