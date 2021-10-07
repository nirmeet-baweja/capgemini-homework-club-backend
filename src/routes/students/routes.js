import express from 'express'
import { getStudent } from './controllers'

const router = express.Router()

// localhost:3001/students
router.get('/:userId', getStudent)

export default router
