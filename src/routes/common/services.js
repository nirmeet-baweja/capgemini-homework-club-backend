import knex from '../../knex'

const getRoles = async () => {
  const roles = await knex('roles').select('*').orderBy('id')
  return roles
}

const getUpcomingClasses = async (today) => {
  const classes = await knex('classes as c')
    .select('c.id', 'c.date', 'c.comments', 'c.call_link', 'c.is_submitted')
    .where('date', '>=', today)
    .orderBy('date')
  return classes
}

const getPastClasses = async (today) => {
  const classes = await knex('classes as c')
    .select('c.id', 'c.date', 'c.comments', 'c.call_link', 'c.is_submitted')
    .where('date', '<=', today)
    .orderBy('date')
  return classes
}

export default {
  getRoles,
  getUpcomingClasses,
  getPastClasses,
}
