import knex from '../../knex'
import services from '../common/services'

const cutOffTime = 16 // set it as 4pm

/* *************************************************************** */
/* Helper functions */

const getClassDate = async (classId) => {
  const [{ classDate }] = await knex('classes')
    .select('date as classDate')
    .where('id', classId)
  return classDate
}

const getVolunteerCutOffDate = (classDate) => {
  const cutOffDate = new Date(classDate)
  cutOffDate.setHours(cutOffTime, 0, 0, 0)
  return cutOffDate
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
  const { comments } = req.body

  const classDate = await getClassDate(classId)
  const cutOffDate = getVolunteerCutOffDate(classDate)

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
            is_cancelled: false,
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
      classDetails = { ...classDetails, userComments: comments }
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
