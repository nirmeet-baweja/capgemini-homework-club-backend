import sgMail from '@sendgrid/mail'
import knex from '../../knex'
import services from '../common/services'
import config from '../../config'

const cutOffTime = 17 // set it as 5pm

/* *************************************************************** */
/* Helper functions */

const getClassDate = async (classId) => {
  const [{ classDate }] = await knex('classes')
    .select('date as classDate')
    .where('id', classId)

  return classDate
}

const getStudentCutOffDate = (classDate) => {
  const cutOffDate = new Date(classDate)
  cutOffDate.setDate(classDate.getDate() - 2)
  cutOffDate.setHours(cutOffTime, 0, 0, 0)

  return cutOffDate
}

const sendEmail = async (user) => {
  sgMail.setApiKey(config.sendGridKey)
  const msg = {
    to: user.email,
    from: config.email, // your email
    subject: 'Class signUp',
    html: `
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
                        <div style="background-color: #e0101a; height: 226px;"></div>
                    </td>
                    <td>
                        <img style="width: 545px; height: 226px; margin: 0 10px;" alt="cyf-email-05"
                            src="https://cyf-assets-buckets.s3.eu-west-2.amazonaws.com/emailTemplate/cyf-email-05.jpg" />
                    </td>
                    <td style="width: 33%;">
                        <div style="background-color: #e0101a; height: 226px;"></div>
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
                              We have received your query.
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
                                The CodeYourFuture Team
                            </p>
                            <p style="font-size: 14px;"><br />
                                <br />
                                <a target='_blank' rel='noopener noreferrer'
                                    href="http://codeyourfuture.io">http://codeyourfuture.io</a> - Follow us
                                on
                                <a target='_blank' rel='noopener noreferrer'
                                    href="https://www.facebook.com/codeyourfuture.io/">Facebook</a> and
                                <a target='_blank' rel='noopener noreferrer'
                                    href="https://twitter.com/CodeYourFuture_">Twitter</a><br />
                                Read more about our project on
                                <a target='_blank' rel='noopener noreferrer'
                                    href="https://www.ft.com/content/cd3842d4-8902-11e7-afd2-74b8ecd34d3b">FT,
                                </a>
                                <a target='_blank' rel='noopener noreferrer'
                                    href="https://www.wired.co.uk/article/codeyourfuture-refugee-coding-school">Wired,
                                </a>
                                <a target='_blank' rel='noopener noreferrer'
                                    href="https://www.bbc.co.uk/programmes/p04yzrrg">BBC Tech Tent, </a>
                                <a target='_blank' rel='noopener noreferrer'
                                    href="https://www.unhcr.org/news/stories/2017/1/586e420c7/volunteers-train-refugees-to-crack-into-london-tech-industry.html">UNHCR,
                                </a>and
                                <a target='_blank' rel='noopener noreferrer'
                                    href="https://www.newsdeeply.com/refugees/articles/2016/10/19/welcome-to-londons-refugee-coding-school">
                                    NewsDeeply</a>
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
                            src="https://cyf-assets-buckets.s3.eu-west-2.amazonaws.com/application-process-images/cyf_brand.png" />
                    </td>
                    <td style="width: 33%;">
                        <div style="height: 226px;"></div>
                    </td>
                </tr>
            </tbody>
        </table>
    </body>
    </html>
     `,
  }
  try {
    await sgMail.send(msg)
    return undefined
  } catch (error) {
    console.error(error.toString())
    return 'An internal error occurred, unable to send the email.'
  }
}
/* *************************************************************** */

const getSignedUpClasses = async (req) => {
  const { userId } = req.user

  const today = new Date()
  today.setHours(0, 0, 0)

  let classesSignedUp

  try {
    classesSignedUp = await knex('class_sign_ups as csu')
      .select('csu.class_id as classId')
      .join('classes as c', 'c.id', 'csu.class_id')
      .where('csu.user_id', userId)
      .andWhere('csu.is_cancelled', false)
      .andWhere('c.date', '>=', today)
      .orderBy('csu.class_id')
  } catch (err) {
    return { err: 'Unable to fetch classes.' }
  }

  const classes = classesSignedUp.map((classSignedUp) => classSignedUp.classId)

  return { classes }
}

const signUpForClass = async (req) => {
  const { userId } = req.user
  const { classId } = req.params
  const { comments, skillId } = req.body

  const classDate = await getClassDate(classId)
  const cutOffDate = getStudentCutOffDate(classDate)

  const isSignUpAllowed = new Date() < cutOffDate

  if (isSignUpAllowed) {
    let classSignedUp
    let classDetails
    try {
      classSignedUp = await knex('class_sign_ups')
        .insert(
          {
            user_id: userId,
            class_id: classId,
            skill_id: skillId,
            is_cancelled: false,
            is_present: false,
            comments,
          },
          'class_id'
        )
        .onConflict(['user_id', 'class_id'])
        .merge()

      classDetails = await services.getClassWithId(classSignedUp[0])
      if (classDetails.err) {
        return { err: classDetails.err }
      }
      classDetails = {
        ...classDetails,
        userComments: comments,
        userSkill: skillId,
      }
      sendEmail(req.user)
    } catch (err) {
      return { err: 'Unable to sign up for class.' }
    }
    return classDetails
  }
  return {
    err: 'Cut-off time for the class sign-up is over, you can no longer sign up for this class.',
  }
}

const cancelClassSignUp = async (req) => {
  const { userId } = req.user
  const { classId } = req.params

  let classesSignedUp

  try {
    classesSignedUp = await knex('class_sign_ups')
      .update({ is_cancelled: true }, 'class_id')
      .where('user_id', userId)
      .andWhere('class_id', classId)
  } catch (err) {
    return { err: 'Unable to update class sign up.' }
  }

  return classesSignedUp[0]
}

export default {
  getSignedUpClasses,
  signUpForClass,
  cancelClassSignUp,
}
