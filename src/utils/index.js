// utils here
import jwt from 'jsonwebtoken'
import config from '../config'

export async function authHelper(req, res, next) {
  try {
    console.log('authHelper')
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1]
      const tokenUser = jwt.verify(token, config.tokenSecret)
      console.log('tokenUser')
      console.log(tokenUser)
      // should the checks include password as well?

      next()
    }
  } catch (err) {
    res.sendStatus(401)
  }
}

export async function checkAdmin(req, res, next) {
  try {
    console.log('checkAdmin')
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1]
      const tokenUser = jwt.verify(token, config.tokenSecret)
      console.log('tokenUser')
      console.log(tokenUser)
      // do checkes
      if (tokenUser.roleId !== 1) {
        throw new Error()
      } else {
        next()
      }
    }
  } catch (err) {
    res.sendStatus(401)
  }
}
