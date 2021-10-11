exports.seed = async function (knex) {
  // array to store the classSignUps
  const classSignUps = []

  const sampleComments = [
    'Sed ante. Vivamus tortor. Duis mattis egestas metus.',
    'In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.',
    'Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.',
    'Fusce consequat. Nulla nisl. Nunc nisl.',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ]

  // function to return a random number in a given range of numbers
  const getRandomIntInclusive = (min, max) => {
    const ceilMin = Math.ceil(min)
    const floorMax = Math.floor(max)
    // The maximum is inclusive and the minimum is inclusive
    return Math.floor(Math.random() * (floorMax - ceilMin + 1) + ceilMin)
  }

  // function to create a single object for class_sign_ups table
  const createSignUp = (userId, classId) => {
    const isCancelled = Math.random() > 0.85
    let isPresent = Math.random() < 0.85

    // if a sign-up has been cancelled the member is considered as absent.
    if (isCancelled) {
      isPresent = false
    }

    const userSignUp = {
      user_id: userId,
      class_id: classId,
      is_cancelled: isCancelled,
      is_present: isPresent,
      comments:
        sampleComments[getRandomIntInclusive(0, sampleComments.length - 1)],
      remarks:
        sampleComments[getRandomIntInclusive(0, sampleComments.length - 1)],
    }
    return userSignUp
  }

  // get the list of all the classes
  const classesId = await knex('classes').select('id').orderBy('id')

  // get the list of all students
  const students = await knex('users')
    .select('id')
    .where('role_id', 3)
    .orderBy('id')

  // get the list of all the volunteers
  const volunteers = await knex('users')
    .select('id')
    .where('role_id', 2)
    .orderBy('id')

  // create the rows for classSignUps for each class
  classesId.forEach((classId) => {
    let studentCount = 0
    let volunteerCount = 0

    const studentIds = []
    const volunteerIds = []

    const numStudents = getRandomIntInclusive(10, 25)
    const numVolunteers = getRandomIntInclusive(2, 6)

    // create the data for students' classSignUp
    while (studentCount < numStudents) {
      const student = getRandomIntInclusive(0, students.length - 1)
      if (!studentIds.includes(student)) {
        studentIds.push(student)
        classSignUps.push(createSignUp(students[student].id, classId.id))
        studentCount += 1
      }
    }

    // create the data for volunteers' classSignUp
    while (volunteerCount < numVolunteers) {
      const volunteer = getRandomIntInclusive(0, volunteers.length - 1)
      if (!volunteerIds.includes(volunteer)) {
        volunteerIds.push(volunteer)
        classSignUps.push(createSignUp(volunteers[volunteer].id, classId.id))
        volunteerCount += 1
      }
    }
  })

  // Deletes ALL existing entries
  return knex('class_sign_ups')
    .del()
    .then(() =>
      // Inserts seed entries
      knex('class_sign_ups').insert(classSignUps)
    )
}
