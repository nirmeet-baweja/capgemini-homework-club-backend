import express from 'express'
import cors from 'cors'
import * as dotenv from 'dotenv'
import { authenticateJWT } from './utils'
import config from './config'

// import new routes from routes
import { admins, auth, common, students, volunteers } from './routes'

dotenv.config()

const startServer = () => {
  const app = express()
    .use(cors())
    .use(express.json({ limit: '50mb', parameterLimit: 50000 }))
    .get('/', (reg, res) => res.status(200).send('Server is up and running!'))
    .use('/auth', auth)
    .use('/data', common)
    .use(authenticateJWT)
    // localhost:3001
    .use('/admins', admins)
    .use('/students', students)
    .use('/volunteers', volunteers)
    .listen(config.port || 3001, () =>
      // eslint-disable-next-line no-console
      console.log(`Listening on ${server.address().port}`)
    )
  return app
}

/* eslint no-use-before-define: "off" */
const server = startServer()

export default server
