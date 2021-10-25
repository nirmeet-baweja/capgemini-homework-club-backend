import knex from '../../knex'

const getSignedUpClasses = async (req) => {
  const { userId } = req.user

  let classesSignedUp

  try {
    classesSignedUp = await knex('class_sign_ups as csu')
      .select('csu.class_id as classId')
      .where('csu.user_id', userId)
      .andWhere('csu.is_cancelled', false)
  } catch (err) {
    return { err: 'Unable to fetch classes.' }
  }

  const classes = classesSignedUp.map((classSignedUp) => classSignedUp.classId)

  return { classes }
}

const cancelClassSignUp = async (req) => {
  const { userId } = req.user
  const { classId } = req.params

  console.log('cancelClassSignUp')
  console.log(userId)
  console.log(classId)

  let classesSignedUp

  try {
    classesSignedUp = await knex('class_sign_ups')
      .update('is_cancelled', true)
      .where('user_id', userId)
      .andWhere('class_id', classId)
  } catch (err) {
    console.log(err)
    return { err: 'Unable to update class sign up.' }
  }

  // const classes = classesSignedUp.map((classSignedUp) => classSignedUp.classId)
  console.log(classesSignedUp)
  return classesSignedUp
}

export default {
  getSignedUpClasses,
  cancelClassSignUp,
}
