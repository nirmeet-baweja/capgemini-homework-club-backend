// utils here
import jwt from 'jsonwebtoken'
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
