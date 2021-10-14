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

/* ************************************************************************* */

const getRoles = async () => {
  const roles = await knex('roles').select('*').orderBy('id')
  return roles
}

const getSkills = async () => {
  const skills = await knex('skills').select('*').orderBy('id')
  return skills
}

const getCohorts = async () => {
  const cohorts = await knex('cohorts').select('*').orderBy('id')
  return cohorts
}

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

const getClassWithId = async (classId) => {
  // get the data from classes table
  const classDetails = await knex('classes')
    .select('id', 'date', 'comments', 'call_link as callLink')
    .where('id', classId)

  console.log(classDetails)
  if (classDetails.length === 0) {
    throw new Error('Invalid class ID.')
  }

  const skills = await getClassSkills(classId)
  const numOfStudents = await getNumOfStudents(classId)
  const numOfVolunteers = await getNumOfVolunteers(classId)

  return {
    ...classDetails[0],
    skills,
    numOfStudents,
    numOfVolunteers,
  }
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
  getSkills,
  getCohorts,
  getClasses,
  getClassWithId,
  getUpcomingClasses,
  getPastClasses,
}
