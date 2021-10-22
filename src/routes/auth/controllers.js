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
    return res.status(400).send({ err })
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
    return res.status(400).send({ err })
  }
}

export const signIn = async (req, res) => {
  try {
    const result = await services.signIn(req) // store into database
    if (result.err) {
      res.status(401).send(result)
    }
    return res.status(200).send(result)
  } catch (err) {
    return res.status(401).send({ err: 'Wrong email and/or password.' })
  }
}
