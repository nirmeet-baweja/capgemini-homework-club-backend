import services from './services'

export const getClassDetails = async (req, res) => {
  try {
    const { classId } = req.params
    const classDetails = await services.getClassDetails(classId)
    return res.json(classDetails)
  } catch (err) {
    return res.status(404).send('Class not found.')
  }
}

export const getUsers = async (req, res) => {
  try {
    const users = await services.getUsers()
    return res.json(users)
  } catch (err) {
    return res.status(404).send('Users not found.')
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

export const getStudents = async (req, res) => {
  try {
    const students = await services.getStudents()
    return res.json(students)
  } catch (err) {
    return res.status(404).send('Students not found.')
  }
}

export const updateClassAttendance = async (req, res) => {
  try {
    // const { classId } = req.params
    const classDetails = await services.updateClassAttendance(req)
    return res.json(classDetails)
  } catch (err) {
    return res.status(404).send('Class not found.')
  }
}
