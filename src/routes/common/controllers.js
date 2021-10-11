import services from './services'

export const getRoles = async (req, res) => {
  try {
    const roles = await services.getRoles()
    return res.json(roles)
  } catch (err) {
    return res.status(404).send('Roles not found.')
  }
}

export const getUpcomingClasses = async (req, res) => {
  const today = new Date() // date should be in format "yyyy-mm-dd"
  try {
    const classes = await services.getUpcomingClasses(today)
    return res.json(classes)
  } catch (err) {
    return res.status(404).send('Classes not found.')
  }
}
