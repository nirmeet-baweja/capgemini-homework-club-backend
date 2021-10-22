// utils here
import jwt from 'jsonwebtoken'
import knex from '../knex'
import roles from './roles.json'
import config from '../config'

/* *************************************************************** */
/* Helper functions */

const checkUserAccess = (role, path) => {
  const tmpStr = path.match('^(.*)/')
  const startingPath = tmpStr[1]
  const [selectedRole] = roles.filter((item) => item.role === role)
  return role === 'Admin' || selectedRole.paths.includes(startingPath)
}
/* *************************************************************** */

export async function authHelper(req, res, next) {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1]
      const tokenUser = jwt.verify(token, config.tokenSecret)

      // if user exists, use the roles from the database not the token
      const [user] = await knex('users as u')
        .join('roles as r', 'r.id', 'u.role_id')
        .select('u.id as userId', 'u.email', 'r.name as role')
        .where('u.id', tokenUser.userId)

      // is this allowed?
      req.lookUpUser = user

      if (!checkUserAccess(user.role, req.url)) {
        res.sendStatus(401)
      }
      next()
    }
    res.sendStatus(401)
  } catch (err) {
    res.sendStatus(401)
  }
}

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (authHeader) {
    const token = authHeader.split(' ')[1]

    // eslint-disable-next-line consistent-return
    jwt.verify(token, config.tokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403)
      }

      if (!checkUserAccess(user.role, req.url)) {
        return res.sendStatus(403)
      }

      req.user = user
      next()
    })
  } else {
    res.sendStatus(401)
  }
}
