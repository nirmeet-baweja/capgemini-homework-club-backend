import services from './services'

export const getUsers = async (req, res) => {
  try {
    const users = await services.getUsers()
    return res.json(users)
  } catch (err) {
    return res.status(404).send('Users not found.')
  }
}

export const getAdmins = async (req, res) => {
  try {
    const admins = await services.getAdmins()
    return res.json(admins)
  } catch (err) {
    return res.status(404).send('Admins not found.')
  }
}

export const updateAdminRole = async (req, res) => {
  try {
    const result = await services.updateAdminRole(req)
    if (result.err) {
      return res.status(500).send(result.err)
    }
    return res.status(201).send(result)
  } catch (err) {
    return res.status(400).send('Failed to change the user role.')
  }
}

export const getVolunteers = async (req, res) => {
  try {
    const volunteers = await services.getVolunteers()
    return res.json(volunteers)
  } catch (err) {
    return res.status(404).send('Volunteers not found.')
  }
}

export const updateVolunteerRole = async (req, res) => {
  try {
    const result = await services.updateVolunteerRole(req)
    if (result.err) {
      return res.status(500).send(result.err)
    }
    return res.status(201).send(result)
  } catch (err) {
    return res.status(400).send('Failed to change the user role.')
  }
}

export const getStudents = async (req, res) => {
  try {
    const students = await services.getStudents()
    return res.json(students)
  } catch (err) {
    return res.status(404).send('Students not found.')
  }
}

export const getSignedUpClasses = async (req, res) => {
  try {
    const result = await services.getSignedUpClasses(req)
    if (result.err) {
      return res.status(404).send(result.err)
    }
    return res.json(result.classes)
  } catch (err) {
    return res.status(404).send('Classes not found.')
  }
}

export const cancelClassSignUp = async (req, res) => {
  try {
    const result = await services.cancelClassSignUp(req)
    if (result.err) {
      return res.status(400).send(result.err)
    }
    return res
      .status(200)
      .send({ message: `Cancelled the sign-up for class ${result}` })
  } catch (err) {
    return res.status(400).send('Unable to cancel class sign up.')
  }
}

export const createNewClass = async (req, res) => {
  try {
    const result = await services.createNewClass(req)
    if (result.err) {
      return res.status(400).send(result.err)
    }
    return res.status(201).send(result)
  } catch (err) {
    return res.status(400).send('Failed to create class.')
  }
}

export const getClassDetails = async (req, res) => {
  try {
    const { classId } = req.params
    const classDetails = await services.getClassDetails(classId)
    return res.json(classDetails)
  } catch (err) {
    return res.status(404).send('Class not found.')
  }
}

export const updateClassAttendance = async (req, res) => {
  try {
    const result = await services.updateClassAttendance(req)
    if (result.err) {
      return res.status(400).send(result.err)
    }
    return res.status(201).send(result)
  } catch (err) {
    return res.status(400).send('Class attendance not submitted.')
  }
}

export const getAttendance = async (req, res) => {
  try {
    const attendance = await services.getAttendance()
    return res.json(attendance)
  } catch (err) {
    return res.status(404).send('Attendance not found.')
  }
}
