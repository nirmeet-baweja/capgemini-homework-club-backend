import knex from '../../knex'

const getRoles = async () => {
  const roles = await knex('roles').select('*').orderBy('id')
  return roles
}

const getClasses = async () => {
  const classes = await knex('classes')
    .select('id', 'date', 'comments', 'call_link', 'is_submitted')
    .orderBy('date')
  return classes
}

const getUpcomingClasses = async (today) => {
  const classes = await knex('classes as c')
    .select('c.id', 'c.date', 'c.comments', 'c.call_link', 'c.is_submitted')
    .where('date', '>=', today)
    .orderBy('date')
  return classes
}

const getUsers = async () => {
  const users = await knex('users')
    .select('firstname', 'last_name', 'email', 'role_id', 'cohort_id')
    .orderBy('id')
  return users
}

const getVolunteers = async () => {
  const volunteers = await knex('users')
    .select('firstname', 'last_name', 'email')
    .where('role_id', 2)
    .orderBy('id')
  return volunteers
}

const getStudents = async () => {
  const students = await knex('users')
    .select('firstname', 'last_name', 'email', 'cohort_id')
    .where('role_id', 3)
    .orderBy('id')
  return students
}

export default {
  getRoles,
  getClasses,
  getUpcomingClasses,
  getUsers,
  getVolunteers,
  getStudents,
}
