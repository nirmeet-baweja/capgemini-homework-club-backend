import knex from '../../knex'

/* ************************************************************************* */
/* Helper functions */

const getNumOfStudents = async (classID) => {
  // get the number of students signed up for the class
  const numOfStudents = await knex('class_sign_ups as csu')
    .join('users as u', 'u.id', 'csu.user_id')
    .where('csu.class_id', classID)
    .andWhere('u.role_id', 3)
    .count('u.id')

  return numOfStudents[0].count
}

const getNumOfVolunteers = async (classID) => {
  // get the number of volunteers signed up for the class
  const numOfVolunteers = await knex('class_sign_ups as csu')
    .join('users as u', 'u.id', 'csu.user_id')
    .where('csu.class_id', classID)
    .andWhere('u.role_id', 2)
    .count('u.id')

  return numOfVolunteers[0].count
}

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
    .select('u.firstname', 'u.last_name', 's.name as skill')
    .join('users as u', 'u.id', 'csu.user_id')
    .join('skills as s', 's.id', 'csu.skill_id')
    .where('csu.class_id', classID)
    .andWhere('u.role_id', 3)

  return listOfStudents
}

const getVolunteersSignedUp = async (classID) => {
  // get the volunteers signed up for the class
  const listOfVolunteers = await knex('class_sign_ups as csu')
    .select('u.id', 'u.firstname', 'u.last_name')
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
const getClassDetails = async (classID) => {
  // get the data from classes table
  const classDetails = await knex('classes')
    .select('id', 'date', 'comments', 'call_link as callLink')
    .where('id', classID)

  const skills = await getClassSkills(classID)
  const numOfStudents = await getNumOfStudents(classID)
  const numOfVolunteers = await getNumOfVolunteers(classID)
  const listOfStudents = await getStudentsSignedUp(classID)
  const listOfVolunteers = await getVolunteersSignedUp(classID)
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
  const users = await knex('users')
    .select('firstname', 'last_name', 'email', 'role_id', 'cohort_id')
    .orderBy('id')
  return users
}

const getVolunteers = async () => {
  const volunteers = await knex('users')
    .select('id', 'firstname', 'last_name', 'email')
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
    .select('u.firstname', 'u.last_name', 'u.email', 'c.name as cohort')
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
