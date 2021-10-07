import express from 'express'
import { getVolunteer } from './controllers'

const router = express.Router()
// localhost:3001/volunteers
router.get('/:userId', getVolunteer)

export default router
