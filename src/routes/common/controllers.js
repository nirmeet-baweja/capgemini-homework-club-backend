const knex = require('../../knex')

export const getListOfStudyGroups = async (req, res) => {
  try {
    return res.status(200).send([{ id: 'return list of HWC study group' }])
  } catch (err) {
    console.log(err)
    return res.status(400).send('Error')
  }
}

export const getRoles = async (req, res) => {
  const roles = await knex('roles').select('*').orderBy('id')
  res.json(roles)
}

export const getUsers = async (req, res) => {
  const users = await knex('users')
    .select('firstname', 'last_name', 'email', 'role_id', 'cohort_id')
    .orderBy('id')
  res.json(users)
}

export const getVolunteers = async (req, res) => {
  const volunteers = await knex('users')
    .select('firstname', 'last_name', 'email')
    .where('role_id', 2)
    .orderBy('id')
  res.json(volunteers)
}

export const getStudents = async (req, res) => {
  const students = await knex('users')
    .select('firstname', 'last_name', 'email', 'cohort_id')
    .where('role_id', 3)
    .orderBy('id')
  res.json(students)
}

export const getClasses = async (req, res) => {
  const classes = await knex('classes').select('*').orderBy('id')
  res.json(classes)
}
