// utils here
import jwt from 'jsonwebtoken'
import roles from './roles.json'
import config from '../config'

/* *************************************************************** */
/* Helper functions */

const checkUserAccess = (role, path) => {
  const tmpStr = path.match('^/(.*?)/')
  const startingPath = tmpStr[1]
  const [selectedRole] = roles.filter((item) => item.role === role)
  return role === 'Admin' || selectedRole.paths.includes(startingPath)
}
/* *************************************************************** */

export const authenticateJWT = (req, res, next) => {
  // make the /auth/reset-password/:token as a public route
  if (req.url.includes('/auth/reset-password')) {
    next()
  }

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

export const studentConfirmationEmail = (data, user) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>booking confirmation email</title>
      <style>
          u~div .gmail-hide {
              display: none;
          }
          u~div .gmail-show {
              display: block !important;
          }
          @media yahoo {
              .yahoo-hide {
                  display: none;
              }
              .yahoo-show {
                  display: block !important;
              }
          }
      </style>
  </head>
  <body>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0; font-family: Arial, Helvetica, sans-serif;">
          <tbody width="100%">
              <tr style="width: 100%;">
              <td style="width: 33%;">
              <div style="background-color: #59bfff; height: 226px;"></div>
          </td>
          <td>
              <img style="width: 570px; height: 226px; margin: 0 10px;" alt="cyf-email-05"
                  src="https://isg-one.com/images/default-source/default-album/capgemini-altran-acquisition.tmb-th1190-446.jpg?sfvrsn=526bc031_0" />
          </td>
          <td style="width: 33%;">
              <div style="background-color: #59bfff; height: 226px;"></div>
          </td>
              </tr>
              <tr style="width: 100%;">
                  <td style="width: 33%;">
                      <div></div>
                  </td>
                  <td>
                      <div style="width: 545px; margin:10px;">
                          <p style="
                          margin-top: 0;
                          font-size: 14px;
                          line-height: 1.2rem;
                        ">
                              Dear ${user.firstName},
                          </p>
                          <p style="
                          margin-top: 0;
                          font-size: 14px;
                          line-height: 1.2rem;
                        ">
                        <p style="
                        margin-top: 0;
                        margin-bottom: 6px;
                        font-size: 14px;
                        line-height: 1.2rem;
                      ">
                        Thanks for registering your interest for homework club.
                        </p>
                              <p style="
                              margin-top: 0;
                              margin-bottom: 6px;
                              font-size: 14px;
                              line-height: 1.2rem;
                            ">
                            We have received your query: "${data.userComments}"
                              </p>
                              </p>
                              <p style="
                              margin-top: 0;
                              margin-bottom: 6px;
                              font-size: 14px;
                              line-height: 1.2rem;
                            ">
                            However, be rest assured that we will provide you the necessary support needed.
                              </p>
                          <br />
                          <p style="
                                      margin-top: 0;
                                      margin-bottom: 6px;
                                      font-size: 14px;
                                      line-height: 1.2rem;
                                    ">
                              Best Regards,
                          </p>
                          <p style="
                                      margin-top: 0;
                                      margin-bottom: 6px;
                                      font-size: 14px;
                                      line-height: 1.2rem;
                                    ">
                              The Capgemini Team
                          </p>
                      </div>
                  </td>
                  <td style="width: 33%;">
                      <div></div>
                  </td>
              </tr>
              <tr style="width: 100%;">
                  <td style="width: 33%;">
                      <div style="height: 226px;"></div>
                  </td>
                  <td>
                      <img style="width: 545px; height: 226px; margin: 0 10px;" alt="cyf_brand"
                          src="https://marketplace.intel.com/file-asset/a5Q3b00000066ktEAA_a5S3b0000016NjOEAU?isOptimized=false" />
                  </td>
                  <td style="width: 33%;">
                      <div style="height: 226px;"></div>
                  </td>
              </tr>
          </tbody>
      </table>
  </body>
  </html>
   `

export const volunteerConfirmationEmail = (data) => `
    <!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>booking confirmation email</title>
      <style>
          u~div .gmail-hide {
              display: none;
          }
  
          u~div .gmail-show {
              display: block !important;
          }
  
          @media yahoo {
              .yahoo-hide {
                  display: none;
              }
  
              .yahoo-show {
                  display: block !important;
              }
          }
      </style>
  </head>
  
  <body>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0; font-family: Arial, Helvetica, sans-serif;">
          <tbody width="100%">
          <td style="width: 33%;">
          <div style="background-color: #59bfff; height: 226px;"></div>
      </td>
      <td>
          <img style="width: 570px; height: 226px; margin: 0 10px;" alt="cyf-email-05"
              src="https://isg-one.com/images/default-source/default-album/capgemini-altran-acquisition.tmb-th1190-446.jpg?sfvrsn=526bc031_0" />
      </td>
      <td style="width: 33%;">
          <div style="background-color: #59bfff; height: 226px;"></div>
      </td>
              </tr>
              <tr style="width: 100%;">
                  <td style="width: 33%;">
                      <div></div>
                  </td>
                  <td>
                      <div style="width: 545px; margin:10px;">
                          <p style="
                          margin-top: 0;
                          font-size: 14px;
                          line-height: 1.2rem;
                        ">
                              Dear volunteer,
                          </p>
                          <p style="
                          margin-top: 0;
                          font-size: 14px;
                          line-height: 1.2rem;
                        ">
                        <p style="
                        margin-top: 0;
                        margin-bottom: 6px;
                        font-size: 14px;
                        line-height: 1.2rem;
                      ">
                        We want to inform you that ${data.numOfStudents} students have booked for the class scheduled on ${data.date}.If you have any query, please send a message to the admin for more information.
                        </p>
                          <br />
                          <p style="
                                      margin-top: 0;
                                      margin-bottom: 6px;
                                      font-size: 14px;
                                      line-height: 1.2rem;
                                    ">
                              Best Regards,
                          </p>
                          <p style="
                                      margin-top: 0;
                                      margin-bottom: 6px;
                                      font-size: 14px;
                                      line-height: 1.2rem;
                                    ">
                              The Capgemini Team
                          </p>
    
                      </div>
                  </td>
              </tr>
              <tr style="width: 100%;">
                  <td style="width: 33%;">
                      <div style="height: 226px;"></div>
                  </td>
                  <td>
                      <img style="width: 545px; height: 226px; margin: 0 10px;" alt="cyf_brand"
                          src="https://marketplace.intel.com/file-asset/a5Q3b00000066ktEAA_a5S3b0000016NjOEAU?isOptimized=false" />
                  </td>
                  <td style="width: 33%;">
                      <div style="height: 226px;"></div>
                  </td>
              </tr>
          </tbody>
      </table>
  </body>
  
  </html>
  `

export const sendEmailForPasswordResetLink = (user, token) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>booking confirmation email</title>
      <style>
          u~div .gmail-hide {
              display: none;
          }
          u~div .gmail-show {
              display: block !important;
          }
          @media yahoo {
              .yahoo-hide {
                  display: none;
              }
              .yahoo-show {
                  display: block !important;
              }
          }
      </style>
  </head>
  <body>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0; font-family: Arial, Helvetica, sans-serif;">
          <tbody width="100%">
              <tr style="width: 100%;">
                  <td style="width: 33%;">
                      <div style="background-color: #59bfff; height: 226px;"></div>
                  </td>
                  <td>
                      <img style="width: 570px; height: 226px; margin: 0 10px;" alt="cyf-email-05"
                          src="https://isg-one.com/images/default-source/default-album/capgemini-altran-acquisition.tmb-th1190-446.jpg?sfvrsn=526bc031_0" />
                  </td>
                  <td style="width: 33%;">
                      <div style="background-color: #59bfff; height: 226px;"></div>
                  </td>
              </tr>
              <tr style="width: 100%;">
                  <td style="width: 33%;">
                      <div></div>
                  </td>
                  <td>
                      <div style="width: 545px; margin:10px;">
                          <p style="
                          margin-top: 0;
                          font-size: 14px;
                          line-height: 1.2rem;
                        ">
                              Dear ${`${user.firstname} ${user.last_name}`},
                          </p>
                          <p style="
                          margin-top: 0;
                          font-size: 14px;
                          line-height: 1.2rem;
                        ">
                        <p style="
                        margin-top: 0;
                        margin-bottom: 6px;
                        font-size: 14px;
                        line-height: 1.2rem;
                      ">
                      You have requested to reset your password..
                        </p>
                              <p style="
                              margin-top: 0;
                              margin-bottom: 6px;
                              font-size: 14px;
                              line-height: 1.2rem;
                            ">
                            Please, click the link below to reset your password
                              </p>
                      
                              <p style="
                              margin-top: 0;
                              margin-bottom: 6px;
                              font-size: 14px;
                              line-height: 1.2rem;
                            ">
                            <a href="${
                              config.frontEndUrl
                            }/reset-password/${token}">${token}</a>
                              </p>
                          <br />
                          <p style="
                                      margin-top: 0;
                                      margin-bottom: 6px;
                                      font-size: 14px;
                                      line-height: 1.2rem;
                                    ">
                              Best Regards,
                          </p>
                          <p style="
                                      margin-top: 0;
                                      margin-bottom: 6px;
                                      font-size: 14px;
                                      line-height: 1.2rem;
                                    ">
                              The Capgemini Team
                          </p>
                      </div>
                  </td>
                  <td style="width: 33%;">
                      <div></div>
                  </td>
              </tr>
              <tr style="width: 100%;">
                  <td style="width: 33%;">
                      <div style="height: 226px;"></div>
                  </td>
                  <td>
                      <img style="width: 545px; height: 226px; margin: 0 10px;" alt="cyf_brand"
                          src="https://marketplace.intel.com/file-asset/a5Q3b00000066ktEAA_a5S3b0000016NjOEAU?isOptimized=false" />
                  </td>
                  <td style="width: 33%;">
                      <div style="height: 226px;"></div>
                  </td>
              </tr>
          </tbody>
      </table>
  </body>
  </html>
   `
