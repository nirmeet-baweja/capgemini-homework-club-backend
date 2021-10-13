import services from './services'

export const getClasses = async (req, res) => {
  try {
    const classes = await services.getClasses()
    return res.json(classes)
  } catch (err) {
    return res.status(404).send(`Classes not found. Error : ${err}`)
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
