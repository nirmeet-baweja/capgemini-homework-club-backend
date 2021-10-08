import express from 'express'
import { studentSignUp } from './controllers'

const router = express.Router()
// localhost:3001/auth
router.post('/student/sign-up', studentSignUp)
// router.get("/volunteer/sign-up", );
// router.get("/sign-in", );

export default router
