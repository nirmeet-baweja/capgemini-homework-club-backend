import knex from '../../knex'

const getSignedUpClasses = async (req) => {
  const { userId } = req.user

  let classesSignedUp

  try {
    classesSignedUp = await knex('class_sign_ups as csu')
      .select('csu.class_id as classId')
      .where('csu.user_id', userId)
  } catch (err) {
    return { err: 'Unable to fetch classes.' }
  }

  const classes = classesSignedUp.map((classSignedUp) => classSignedUp.classId)

  return { classes }
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
  cancelClassSignUp,
}
