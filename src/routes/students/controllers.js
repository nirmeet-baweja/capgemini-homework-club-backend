import services from './services'

export const getSignedUpClasses = async (req, res) => {
  try {
    const result = await services.getSignedUpClasses(req) // store into database
    if (result.err) {
      return res.status(404).send(result.err)
    }
    return res.json(result.classes)
  } catch (err) {
    return res.status(401).send('Classes not found.')
  }
}
