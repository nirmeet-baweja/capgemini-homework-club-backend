import sgMail from '@sendgrid/mail'
import knex from '../../knex'
import services from '../common/services'
import { confirmationEmail } from '../../utils'
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

const sendEmail = async (user, data) => {
  sgMail.setApiKey(config.sendGridKey)
  const msg = {
    to: user.email,
    from: config.email, // your email
    subject: 'Class signUp',
    html: confirmationEmail(data, user),
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
      sendEmail(req.user, classDetails)
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
