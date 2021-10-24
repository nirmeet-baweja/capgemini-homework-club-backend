import * as dotenv from 'dotenv'

dotenv.config()
const config = {
  env: process.env.ENV,
  port: process.env.PORT,
  appUrl: process.env.APP_URL,
  tokenSecret: process.env.TOKEN_SECRET,
}

export default config
