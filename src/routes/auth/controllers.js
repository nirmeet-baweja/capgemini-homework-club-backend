import services from './services'

export const studentSignUp = async (req, res) => {
  try {
    const error = await services.validateSignUp(req.body) // validate data
    if (error.message) {
      return res.status(400).send(error.message)
    }

    await services.studentSignUp(req.body) // store into database
    return res.status(200).send('sign up')
  } catch (err) {
    console.log(err)
    return res.status(400).send('something went wrong')
  }
}
