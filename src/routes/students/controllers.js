import services from './services'

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
