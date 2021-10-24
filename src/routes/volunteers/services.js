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

export default {
  getSignedUpClasses,
}
