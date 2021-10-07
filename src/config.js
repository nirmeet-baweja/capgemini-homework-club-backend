import * as dotenv from 'dotenv'

dotenv.config()
const config = {
  env: process.env.ENV,
  port: process.env.PORT,
  appUrl: process.env.APP_URL,
}

export default config
