import knex from '../../knex'

/* ************************************************************************* */
/* Helper functions */

const getClassSkills = async (classID) => {
  const classSkills = await knex('class_skills as cs')
    .select('s.name')
    .join('skills as s', 's.id', 'cs.skill_id')
    .where('cs.class_id', classID)

  const skills = classSkills.map((classSkill) => classSkill.name)

  return skills
}

const getUserSkills = async (userID) => {
  const userSkills = await knex('user_skills as us')
    .select('s.name')
    .join('skills as s', 's.id', 'us.skill_id')
    .where('us.user_id', userID)

  const skills = userSkills.map((userSkill) => userSkill.name)

  return skills
}

const getStudentsSignedUp = async (classID) => {
  // get the students signed up for the class
  const listOfStudents = await knex('class_sign_ups as csu')
    .select(
      'u.firstname as firstName',
      'u.last_name as lastName',
      's.name as skill'
    )
    .join('users as u', 'u.id', 'csu.user_id')
    .join('skills as s', 's.id', 'csu.skill_id')
    .where('csu.class_id', classID)
    .andWhere('u.role_id', 3)

  return listOfStudents
}

const getVolunteersSignedUp = async (classID) => {
  // get the volunteers signed up for the class
  const listOfVolunteers = await knex('class_sign_ups as csu')
    .select('u.id', 'u.firstname as firstName', 'u.last_name as lastName')
    .join('users as u', 'u.id', 'csu.user_id')
    .where('csu.class_id', classID)
    .andWhere('u.role_id', 2)

  // function to fetch the skills for each volunteer
  const fetchUserSkills = async () => {
    await Promise.all(
      listOfVolunteers.map(async (volunteer, index) => {
        const skills = await getUserSkills(volunteer.id)
        // amend the skills for each class
        listOfVolunteers[index] = { ...listOfVolunteers[index], skills }
      })
    )
  }
  await fetchUserSkills()
  return listOfVolunteers
}

/* ************************************************************************* */

// eslint-disable-next-line arrow-body-style
const getClassDetails = async (classID) => {
  // get the data from classes table
  const classDetails = await knex('classes')
    .select('id', 'date', 'comments', 'call_link as callLink')
    .where('id', classID)

  const skills = await getClassSkills(classID)
  const listOfStudents = await getStudentsSignedUp(classID)
  const listOfVolunteers = await getVolunteersSignedUp(classID)

  return {
    ...classDetails[0],
    skills,
    listOfStudents,
    listOfVolunteers,
  }
}

const getUsers = async () => {
  const users = await knex('users as u')
    .select(
      'u.id',
      'u.firstname as firstName',
      'u.last_name as lastName',
      'u.email',
      'r.name as role'
    )
    .join('roles as r', 'r.id', 'u.role_id')
    .orderBy('u.id')
  return users
}

const getVolunteers = async () => {
  const volunteers = await knex('users')
    .select('id', 'firstname as firstName', 'last_name as lastName', 'email')
    .where('role_id', 2)
    .orderBy('id')

  // function to fetch the skills for each volunteer
  const fetchUserSkills = async () => {
    await Promise.all(
      volunteers.map(async (volunteer, index) => {
        const skills = await getUserSkills(volunteer.id)
        // amend the skills for each class
        volunteers[index] = { ...volunteers[index], skills }
      })
    )
  }

  await fetchUserSkills()

  return volunteers
}

const getStudents = async () => {
  const students = await knex('users as u')
    .select(
      'u.id',
      'u.firstname as firstName',
      'u.last_name as lastName',
      'u.email',
      'c.name as cohort'
    )
    .join('cohorts as c', 'c.id', 'u.cohort_id')
    .where('role_id', 3)
    .orderBy('u.id')
  return students
}

export default {
  getClassDetails,
  getUsers,
  getVolunteers,
  getStudents,
}
