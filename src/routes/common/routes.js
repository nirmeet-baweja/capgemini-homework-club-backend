import express from 'express'
import { getListOfStudyGroups } from './controllers'

const router = express.Router()
// localhost:3001/data
router.get('/study-groups', getListOfStudyGroups)

export default router
