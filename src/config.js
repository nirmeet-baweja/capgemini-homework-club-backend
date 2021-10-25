import * as dotenv from 'dotenv'

dotenv.config()
const config = {
  env: process.env.ENV,
  port: process.env.PORT,
  appUrl: process.env.APP_URL,
  tokenSecret: process.env.TOKEN_SECRET,
  sendGridKey: process.env.SENDGRID_API_KEY,
  email: process.env.EMAIL_ADDRESS,
  frontEndUrl: process.env.FRONTEND_URL,
}

export default config
