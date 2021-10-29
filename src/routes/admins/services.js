import knex from '../../knex'

const adminRoleId = 1
const volunteerRoleId = 2
const studentRoleId = 3

/* ************************************************************************* */
/* Helper functions */

const getClassSkills = async (classId) => {
  const classSkills = await knex('class_skills as cs')
    .select('s.id', 's.name')
    .join('skills as s', 's.id', 'cs.skill_id')
    .where('cs.class_id', classId)

  return classSkills
}

const getUserSkills = async (userId) => {
  const userSkills = await knex('user_skills as us')
    .select('s.id', 's.name')
    .join('skills as s', 's.id', 'us.skill_id')
    .where('us.user_id', userId)

  return userSkills
}

const getStudentsSignedUp = async (classId) => {
  // get the students signed up for the class
  const listOfStudents = await knex('class_sign_ups as csu')
    .select(
      'u.id',
      'u.firstname as firstName',
      'u.last_name as lastName',
      's.name as skill',
      'csu.is_cancelled as isCancelled',
      'csu.is_present as isPresent'
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
    .select(
      'u.id',
      'u.firstname as firstName',
      'u.last_name as lastName',
      'csu.is_cancelled as isCancelled',
      'csu.is_present as isPresent'
    )
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

const updateAdminRole = async (req) => {
  const { adminId } = req.params

  const [admin] = await knex('users')
    .select('firstname')
    .where('id', adminId)
    .andWhere('role_id', adminRoleId)

  if (!admin) {
    /*
      if the user doesn't exist or is not an admin,
      don't change their role
    */
    return { err: 'Unable to change the role of this user to volunteer.' }
  }

  try {
    const [result] = await knex('users')
      .update({ role_id: volunteerRoleId }, 'firstname')
      .where('id', adminId)
    return { message: `Successfully changed ${result}'s role to volunteer` }
  } catch (err) {
    return {
      err: 'Internal Server error occurred and failed to update the role.',
    }
  }
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

const updateVolunteerRole = async (req) => {
  const { volunteerId } = req.params

  const [volunteer] = await knex('users')
    .select('firstname')
    .where('id', volunteerId)
    .andWhere('role_id', volunteerRoleId)

  if (!volunteer) {
    /*
      if the user doesn't exist or is not a volunteer,
      don't promote them
    */
    return { err: 'Cannot promote this user to admin.' }
  }

  try {
    const [result] = await knex('users')
      .update({ role_id: adminRoleId }, 'firstname')
      .where('id', volunteerId)
    return { message: `Successfully promoted ${result} to admin` }
  } catch (err) {
    return {
      err: 'Internal Server error occurred and failed to update the role.',
    }
  }
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

const createNewClass = async (req) => {
  const newClass = req.body
  const newClassDate = new Date(newClass.date)

  const today = new Date()
  const dateMargin = new Date()
  dateMargin.setDate(today.getDate() + 3)

  /* admin can create a class only if it has at least 3 days margin
    to give enough time to students and volunteers to sign-up */
  if (newClassDate >= dateMargin) {
    let newClassId
    try {
      const [classId] = await knex('classes').insert(
        {
          date: newClass.date,
          comments: newClass.comments,
          call_link: newClass.callLink,
          is_submitted: false,
        },
        'id'
      )
      newClassId = classId
    } catch (err) {
      return { err: err.error }
    }

    // function to add class skills for the class just created
    const addClassSkills = async () => {
      await Promise.all(
        newClass.skills.map(async (skill) => {
          await knex('class_skills as cs').insert({
            skill_id: skill,
            class_id: newClassId,
          })
        })
      )
    }

    await addClassSkills()
    return { newClassId }
  }
  return { err: 'Cannot create a class for the given date.' }
}

const getClassDetails = async (classId) => {
  // get the data from classes table
  const classDetails = await knex('classes')
    .select(
      'id',
      'date',
      'comments',
      'call_link as callLink',
      'is_submitted as isSubmitted'
    )
    .where('id', classId)

  const skills = await getClassSkills(classId)
  const listOfStudents = await getStudentsSignedUp(classId)
  const listOfVolunteers = await getVolunteersSignedUp(classId)

  return {
    ...classDetails[0],
    numOfStudents: listOfStudents.length,
    numOfVolunteers: listOfVolunteers.length,
    skills,
    listOfStudents,
    listOfVolunteers,
  }
}

const getAttendance = async () => {
  const attendance = []

  const totalSignUps = await knex('class_sign_ups as csu')
    .join('classes as c', 'c.id', 'csu.class_id')
    .select('class_id as classId', 'c.date')
    .count('class_id as totalSignUps')
    .groupBy('class_id', 'c.date')
    .orderBy('class_id')

  const studentSignUps = await knex('class_sign_ups as csu')
    .join('users as u', 'u.id', 'csu.user_id')
    .select('class_id as classId')
    .count('class_id as studentSignUps')
    .where('u.role_id', studentRoleId)
    .groupBy('class_id')
    .orderBy('class_id')

  const volunteerSignUps = await knex('class_sign_ups as csu')
    .join('users as u', 'u.id', 'csu.user_id')
    .select('class_id as classId')
    .count('class_id as volunteerSignUps')
    .where('u.role_id', volunteerRoleId)
    .groupBy('class_id')
    .orderBy('class_id')

  const studentsPresent = await knex('class_sign_ups as csu')
    .join('users as u', 'u.id', 'csu.user_id')
    .select('class_id as classId')
    .count('class_id as studentsPresent')
    .where('u.role_id', studentRoleId)
    .andWhere('is_present', true)
    .groupBy('class_id')
    .orderBy('class_id')

  const volunteersPresent = await knex('class_sign_ups as csu')
    .join('users as u', 'u.id', 'csu.user_id')
    .select('class_id as classId')
    .count('class_id as volunteersPresent')
    .where('u.role_id', volunteerRoleId)
    .andWhere('is_present', true)
    .groupBy('class_id')
    .orderBy('class_id')

  totalSignUps.forEach((signUp, index) => {
    attendance.push({
      ...totalSignUps[index],
      ...studentSignUps[index],
      ...volunteerSignUps[index],
      ...studentsPresent[index],
      ...volunteersPresent[index],
    })
  })

  // console.log(attendance)
  return attendance
}

const updateClassAttendance = async (req) => {
  const { classId } = req.params
  const attendanceDetails = req.body

  // function to update the attendance for a given class
  const updateAttendance = async () => {
    await Promise.all(
      attendanceDetails.map(async (attendance) => {
        await knex('class_sign_ups as csu')
          .where('csu.class_id', classId)
          .andWhere('csu.user_id', attendance.userId)
          .update({ is_present: attendance.isPresent })
      })
    )
  }

  await updateAttendance()

  await knex('classes').where('id', classId).update({ is_submitted: true })
}

const createNewCohort = async (req) => {
  const newCohort = req.body
  if (!newCohort.cohortName) {
    return {}
  }
  return {}
  // const result = await knex('cohorts').insert()
}

export default {
  getClassDetails,
  getUsers,
  updateAdminRole,
  getVolunteers,
  updateVolunteerRole,
  getStudents,
  createNewClass,
  getAttendance,
  updateClassAttendance,
  createNewCohort,
}
