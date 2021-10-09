import services from './services'

export const getRoles = async (req, res) => {
  try {
    const roles = await services.getRoles()
    return res.json(roles)
  } catch (err) {
    return res.status(404).send('Roles not found.')
  }
}

export const getClasses = async (req, res) => {
  try {
    const classes = await services.getClasses()
    return res.json(classes)
  } catch (err) {
    return res.status(404).send('Classes not found.')
  }
}

export const getUpcomingClasses = async (req, res) => {
  const { today } = req.body // date should be in format "yyyy-mm-dd"
  try {
    const classes = await services.getUpcomingClasses(today)
    return res.json(classes)
  } catch (err) {
    return res.status(404).send('Classes not found.')
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
