// utils here
import jwt from 'jsonwebtoken'
import knex from '../knex'
import roles from './roles.json'
import config from '../config'

/* *************************************************************** */
/* Helper functions */

const checkUserAccess = (role, path) => {
  const tmpStr = path.match('^/(.*)/')
  const newStr = tmpStr[1]
  console.log(newStr)
  // const paths = roles.find((item) => item.role === role)
  // return paths.includes(path)
}
/* *************************************************************** */

// add roles as json file
export async function authHelper(req, res, next) {
  try {
    // req has route
    //
    console.log(req.url)
    // const route = req.path
    console.log('authHelper')
    console.log(roles)

    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1]
      const tokenUser = jwt.verify(token, config.tokenSecret)
      // if user exists, use the roles from the database not the token
      console.log('tokenUser')
      console.log(tokenUser.role.toLowerCase())

      const [user] = await knex('users as u')
        .join('roles as r', 'r.id', 'u.role_id')
        .select('u.id as userId', 'u.email', 'r.name as role')
        .where('u.id', tokenUser.userId)

      console.log('user')
      console.log(user)
      checkUserAccess(user.role, req.url)
      // should the checks include password as well?
      if (user.role.toLowerCase() === 'admin') {
        next()
      } else {
        res.sendStatus(401)
      }
    }
    // console.log('calling next here')
    // console.log(next)
    // next()
  } catch (err) {
    res.sendStatus(401)
  }
}
