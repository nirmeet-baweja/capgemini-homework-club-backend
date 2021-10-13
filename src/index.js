import express from 'express'
import cors from 'cors'
import * as dotenv from 'dotenv'
import config from './config'
// import new routes from routes
import { admins, auth, common, students, volunteers } from './routes'

dotenv.config()

const startServer = () => {
  const app = express()
    .use(cors())
    .use(express.json({ limit: '50mb', parameterLimit: 50000 }))
    // localhost:3001
    .get('/health', (reg, res) => res.sendStatus(200))
    .use('/admins', admins)
    .use('/auth', auth)
    .use('/students', students)
    .use('/volunteers', volunteers)
    .use('/data', common)
    .listen(config.port || 3001, () =>
      console.log(`Listening on ${server.address().port}`)
    )
  return app
}

/* eslint no-use-before-define: "off" */
const server = startServer()

export default server
