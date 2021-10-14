import services from './services'

export const getRoles = async (req, res) => {
  try {
    const roles = await services.getRoles()
    return res.json(roles)
  } catch (err) {
    return res.status(404).send('Roles not found.')
  }
}

export const getSkills = async (req, res) => {
  try {
    const skills = await services.getSkills()
    return res.json(skills)
  } catch (err) {
    return res.status(404).send('Skills not found.')
  }
}

export const getCohorts = async (req, res) => {
  try {
    const cohorts = await services.getCohorts()
    return res.json(cohorts)
  } catch (err) {
    return res.status(404).send('Cohorts not found.')
  }
}

export const getAllClasses = async (req, res) => {
  try {
    const classes = await services.getClasses('all')
    return res.json(classes)
  } catch (err) {
    return res.status(404).send('Classes not found.')
  }
}

export const getClassWithId = async (req, res) => {
  try {
    const { classId } = req.params
    const classDetails = await services.getClassWithId(classId)
    return res.json(classDetails)
  } catch (err) {
    return res.status(404).send('Class not found.')
  }
}

export const getUpcomingClasses = async (req, res) => {
  // const today = new Date() // date should be in format "yyyy-mm-dd"
  try {
    const classes = await services.getClasses('upcoming')
    return res.json(classes)
  } catch (err) {
    return res.status(404).send('Classes not found.')
  }
}

export const getPastClasses = async (req, res) => {
  // const today = new Date() // date should be in format "yyyy-mm-dd"
  try {
    const classes = await services.getClasses('past')
    return res.json(classes)
  } catch (err) {
    return res.status(404).send('Classes not found.')
  }
}
