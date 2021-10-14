import knex from '../../knex'

/* ************************************************************************* */
/* Helper functions */

const getNumOfStudents = async (classId) => {
  // get the number of students signed up for the class
  const numOfStudents = await knex('class_sign_ups as csu')
    .join('users as u', 'u.id', 'csu.user_id')
    .where('csu.class_id', classId)
    .andWhere('u.role_id', 3)
    .count('u.id')

  return numOfStudents[0].count
}

const getNumOfVolunteers = async (classId) => {
  // get the number of volunteers signed up for the class
  const numOfVolunteers = await knex('class_sign_ups as csu')
    .join('users as u', 'u.id', 'csu.user_id')
    .where('csu.class_id', classId)
    .andWhere('u.role_id', 2)
    .count('u.id')

  return numOfVolunteers[0].count
}

const getClassSkills = async (classId) => {
  const classSkills = await knex('class_skills as cs')
    .select('s.name')
    .join('skills as s', 's.id', 'cs.skill_id')
    .where('cs.class_id', classId)

  const skills = classSkills.map((classSkill) => classSkill.name)

  return skills
}

const getUserSkills = async (userId) => {
  const userSkills = await knex('user_skills as us')
    .select('s.name')
    .join('skills as s', 's.id', 'us.skill_id')
    .where('us.user_id', userId)

  const skills = userSkills.map((userSkill) => userSkill.name)

  return skills
}

const getStudentsSignedUp = async (classId) => {
  // get the students signed up for the class
  const listOfStudents = await knex('class_sign_ups as csu')
    .select(
      'u.firstname as firstName',
      'u.last_name as lastName',
      's.name as skill'
    )
    .join('users as u', 'u.id', 'csu.user_id')
    .join('skills as s', 's.id', 'csu.skill_id')
    .where('csu.class_id', classId)
    .andWhere('u.role_id', 3)

  return listOfStudents
}

const getVolunteersSignedUp = async (classId) => {
  // get the volunteers signed up for the class
  const listOfVolunteers = await knex('class_sign_ups as csu')
    .select('u.id', 'u.firstname as firstName', 'u.last_name as lastName')
    .join('users as u', 'u.id', 'csu.user_id')
    .where('csu.class_id', classId)
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

const getClasses = async () => {
  // get the data from classes table
  const classes = await knex('classes')
    .select(
      'id',
      'date',
      'comments',
      'call_link as callLink',
      'is_submitted as isSubmitted'
    )
    .orderBy('date')

  // function to fetch the skills for each class
  const fetchClassSkills = async () => {
    await Promise.all(
      classes.map(async (homeworkClass, index) => {
        const skills = await getClassSkills(homeworkClass.id)
        // amend the skills for each class
        classes[index] = { ...classes[index], skills }
      })
    )
  }

  // get the number of students and volunteers attending a class
  const fetchNumOfAttendees = async () => {
    await Promise.all(
      // get the number of students signed up for the class
      classes.map(async (homeworkClass, index) => {
        // get the number of students signed up for the class
        const numOfStudents = await getNumOfStudents(homeworkClass.id)

        // amend the number of students signed up for each class
        classes[index] = {
          ...classes[index],
          numOfStudents,
        }

        // get the number of volunteers signed up for the class
        const numOfVolunteers = await getNumOfVolunteers(homeworkClass.id)

        // amend the number of volunteers signed up for each class
        classes[index] = {
          ...classes[index],
          numOfVolunteers,
        }
      })
    )
  }

  await fetchClassSkills()
  await fetchNumOfAttendees()

  return classes
}

// eslint-disable-next-line arrow-body-style
const getClassDetails = async (classId) => {
  // get the data from classes table
  const classDetails = await knex('classes')
    .select('id', 'date', 'comments', 'call_link as callLink')
    .where('id', classId)

  const skills = await getClassSkills(classId)
  const numOfStudents = await getNumOfStudents(classId)
  const numOfVolunteers = await getNumOfVolunteers(classId)
  const listOfStudents = await getStudentsSignedUp(classId)
  const listOfVolunteers = await getVolunteersSignedUp(classId)

  return {
    ...classDetails[0],
    numOfStudents,
    numOfVolunteers,
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
  getClasses,
  getClassDetails,
  getUsers,
  getVolunteers,
  getStudents,
}
