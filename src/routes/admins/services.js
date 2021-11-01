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
      'csu.comments as studentComments',
      'csu.is_cancelled as isCancelled',
      'csu.is_present as isPresent'
    )
    .join('users as u', 'u.id', 'csu.user_id')
    .join('skills as s', 's.id', 'csu.skill_id')
    .where('csu.class_id', classId)
    .andWhere('u.role_id', 3)
    .andWhere('csu.is_cancelled', false)
    .orderBy('u.firstname')

  return listOfStudents
}

const getVolunteersSignedUp = async (classId) => {
  // get the volunteers signed up for the class
  const listOfVolunteers = await knex('class_sign_ups as csu')
    .select(
      'u.id',
      'u.firstname as firstName',
      'u.last_name as lastName',
      'csu.comments as volunteerComments',
      'csu.is_cancelled as isCancelled',
      'csu.is_present as isPresent'
    )
    .join('users as u', 'u.id', 'csu.user_id')
    .where(function () {
      this.where('u.role_id', adminRoleId).orWhere('u.role_id', volunteerRoleId)
    })
    .andWhere('csu.class_id', classId)
    .andWhere('csu.is_cancelled', false)
    .orderBy(['u.role_id', 'u.firstname'])

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

/*
  this function gives you number of classes, a user with a given userId
  has signed up for.
*/
const getClassesSignedUp = async (userId) => {
  const classesSignedUp = await knex('users as u')
    .select('u.id')
    .join('class_sign_ups as csu', 'u.id', 'csu.user_id')
    .where('u.id', userId)
    .count('csu.class_id as classesSignedUp')
    .groupBy('u.id')

  if (classesSignedUp === undefined || classesSignedUp.length === 0) {
    return 0
  }
  return classesSignedUp[0].classesSignedUp
}

/*
  this function gives you number of classes, a user with a given userId
  was present for.
*/
const getClassesAttended = async (userId) => {
  const classesAttended = await knex('users as u')
    .select('u.id')
    .join('class_sign_ups as csu', 'u.id', 'csu.user_id')
    .join('classes as c', 'c.id', 'csu.class_id')
    .where('u.id', userId)
    .andWhere('csu.is_present', true)
    .andWhere('csu.is_cancelled', false)
    .andWhere('c.is_submitted', true)
    .count('csu.class_id as classesAttended')
    .groupBy('u.id')

  if (classesAttended === undefined || classesAttended.length === 0) {
    return 0
  }
  return classesAttended[0].classesAttended
}

/*
  this function gives you the number of classes, a user with a given userId
  was absent for
*/
const getClassesMissed = async (userId) => {
  const classesMissed = await knex('users as u')
    .select('u.id')
    .join('class_sign_ups as csu', 'u.id', 'csu.user_id')
    .join('classes as c', 'c.id', 'csu.class_id')
    .where('u.id', userId)
    .andWhere('csu.is_present', false)
    .andWhere('csu.is_cancelled', false)
    .andWhere('c.is_submitted', true)
    .count('csu.class_id as classesMissed')
    .groupBy('u.id')

  if (classesMissed === undefined || classesMissed.length === 0) {
    return 0
  }
  return classesMissed[0].classesMissed
}

/*
  this function gives you the number of classes, a user with a given userId
  cancelled
*/
const getClassesCancelled = async (userId) => {
  const classesCancelled = await knex('users as u')
    .select('u.id')
    .join('class_sign_ups as csu', 'u.id', 'csu.user_id')
    .where('u.id', userId)
    .andWhere('csu.is_cancelled', true)
    .count('csu.class_id as classesCancelled')
    .groupBy('u.id')

  if (classesCancelled === undefined || classesCancelled.length === 0) {
    return 0
  }
  return classesCancelled[0].classesCancelled
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
    .orderBy(['r.id', 'u.firstname'])

  return users
}

const getAdmins = async () => {
  const admins = await knex('users as u')
    .select(
      'u.id',
      'u.firstname as firstName',
      'u.last_name as lastName',
      'u.email'
    )
    .where('role_id', adminRoleId)
    .orderBy('u.id')

  return admins
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
    .orderBy('firstname')

  // function to fetch the skills and attendance for each volunteer
  const fetchUserSkillsAndAttendance = async () => {
    await Promise.all(
      volunteers.map(async (volunteer, index) => {
        const classesSignedUp = await getClassesSignedUp(volunteer.id)
        const classesAttended = await getClassesAttended(volunteer.id)
        const classesMissed = await getClassesMissed(volunteer.id)
        const classesCancelled = await getClassesCancelled(volunteer.id)
        const skills = await getUserSkills(volunteer.id)
        // amend the skills for each class
        volunteers[index] = {
          ...volunteers[index],
          classesSignedUp,
          classesAttended,
          classesMissed,
          classesCancelled,
          skills,
        }
      })
    )
  }

  await fetchUserSkillsAndAttendance()

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
    .join('class_sign_ups as csu', 'u.id', 'csu.user_id')
    .where('role_id', 3)
    .groupBy('u.id', 'c.name')
    .orderBy('u.firstname')

  // function to fetch the attendance for each student
  const fetchStudentsAttendance = async () => {
    await Promise.all(
      students.map(async (student, index) => {
        const classesSignedUp = await getClassesSignedUp(student.id)
        const classesAttended = await getClassesAttended(student.id)
        const classesMissed = await getClassesMissed(student.id)
        const classesCancelled = await getClassesCancelled(student.id)

        students[index] = {
          ...students[index],
          classesSignedUp,
          classesAttended,
          classesMissed,
          classesCancelled,
        }
      })
    )
  }

  await fetchStudentsAttendance()
  return students
}

// this function returns the classIds of the classes admin has signed up for.
const getSignedUpClasses = async (req) => {
  const { userId } = req.user

  const today = new Date()
  today.setHours(0, 0, 0)

  let classesSignedUp

  try {
    classesSignedUp = await knex('class_sign_ups as csu')
      .select('csu.class_id as classId')
      .join('classes as c', 'c.id', 'csu.class_id')
      .where('csu.user_id', userId)
      .andWhere('csu.is_cancelled', false)
      .andWhere('c.date', '>=', today)
      .orderBy('csu.class_id')
  } catch (err) {
    return { err: 'Unable to fetch classes.' }
  }

  const classes = classesSignedUp.map((classSignedUp) => classSignedUp.classId)

  return { classes }
}

const cancelClassSignUp = async (req) => {
  const { userId } = req.user
  const { classId } = req.params

  let classToCancel

  try {
    classToCancel = await knex('class_sign_ups')
      .update({ is_cancelled: true }, 'class_id')
      .where('user_id', userId)
      .andWhere('class_id', classId)
  } catch (err) {
    return { err: 'Unable to update class sign up.' }
  }

  return classToCancel[0]
}

const createNewClass = async (req) => {
  const newClass = req.body
  const newClassDate = new Date(newClass.date)

  const today = new Date()
  const dateMargin = new Date()
  dateMargin.setDate(today.getDate() + 3)

  /*
    admin can create a class only if it has at least 3 days margin
    to give enough time to students and volunteers to sign-up
  */
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
      return { err: 'Failed to create the class.' }
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

  return attendance
}

const updateClassAttendance = async (req) => {
  const { classId } = req.params
  const attendanceDetails = req.body

  const today = new Date()
  today.setHours(23, 59, 59, 59)

  let classDate = await knex('classes').select('date').where('id', classId)
  classDate = classDate[0].date

  if (classDate < today) {
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
    const result = await knex('classes')
      .where('id', classId)
      .update({ is_submitted: true }, 'id as classId')

    return { message: `Updated the attendance for class ${result[0]}` }
  }
  return {
    err: 'Submitting the attendance for a future class is not permitted.',
  }
}

export default {
  getUsers,
  getAdmins,
  updateAdminRole,
  getVolunteers,
  updateVolunteerRole,
  getStudents,
  getSignedUpClasses,
  cancelClassSignUp,
  createNewClass,
  getClassDetails,
  getAttendance,
  updateClassAttendance,
}
