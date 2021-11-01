import services from './services'

export const getUsers = async (req, res) => {
  try {
    const users = await services.getUsers()
    return res.json(users)
  } catch (err) {
    return res.status(404).send('Users not found.')
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
    return res.status(400).send('Class attendance not submitted.')
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
    return res.status(400).send('Class attendance not submitted.')
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
    await services.updateClassAttendance(req)
    return res.sendStatus(201)
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

export const createNewCohort = async (req, res) => {
  try {
    const result = await services.createNewCohort(req)
    if (result.err) {
      return res.status(400).send(result.err)
    }
    return res.status(201).send(result)
  } catch (err) {
    return res.status(400).send('Failed to create cohort.')
  }
}

export const createNewSkill = async (req, res) => {
  try {
    const result = await services.createNewSkill(req)
    if (result.err) {
      return res.status(400).send(result.err)
    }
    return res.status(201).send(result)
  } catch (err) {
    return res.status(400).send('Failed to create skill.')
  }
}
