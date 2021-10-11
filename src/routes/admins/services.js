import knex from '../../knex'

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
  const fetchSkills = async () => {
    await Promise.all(
      classes.map(async (homeworkClass, index) => {
        const classSkills = await knex('class_skills as cs')
          .select('s.name')
          .join('skills as s', 's.id', 'cs.skill_id')
          .where('cs.class_id', homeworkClass.id)

        const skills = classSkills.map((classSkill) => classSkill.name)
        // amend the skills for each class
        classes[index] = { ...classes[index], skills }
      })
    )
  }

  const fetchNumOfAttendees = async () => {
    await Promise.all(
      // get the number of students signed up for the class
      classes.map(async (homeworkClass, index) => {
        const numOfStudents = await knex('class_sign_ups as csu')
          .join('users as u', 'u.id', 'csu.user_id')
          .where('csu.class_id', homeworkClass.id)
          .andWhere('u.role_id', 3)
          .count('u.id')

        // amend the number of students signed up for each class
        classes[index] = {
          ...classes[index],
          numOfStudents: numOfStudents[0].count,
        }

        // get the number of volunteers signed up for the class
        const numOfVolunteers = await knex('class_sign_ups as csu')
          .join('users as u', 'u.id', 'csu.user_id')
          .where('csu.class_id', homeworkClass.id)
          .andWhere('u.role_id', 2)
          .count('u.id')

        // amend the number of volunteers signed up for each class
        classes[index] = {
          ...classes[index],
          numOfVolunteers: numOfVolunteers[0].count,
        }
      })
    )
  }

  await fetchSkills()
  await fetchNumOfAttendees()

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
  getClasses,
  getUsers,
  getVolunteers,
  getStudents,
}
