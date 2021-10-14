import services from './services'

export const studentSignUp = async (req, res) => {
  try {
    const error = await services.validateStudentSignUp(req)

    if (error) {
      return res.status(400).send(error)
    }

    const result = await services.studentSignUp(req) // store into database
    return res.status(200).send(result)
  } catch (err) {
    return res.status(400).send('something went wrong')
  }
}

export const volunteerSignUp = async (req, res) => {
  try {
    const error = await services.validateVolunteerSignUp(req)

    if (error) {
      return res.status(400).send(error)
    }

    const result = await services.volunteerSignUp(req) // store into database
    return res.status(200).send(result)
    // return res.status(200).send('no error')
  } catch (err) {
    return res.status(400).send('something went wrong')
  }
}
