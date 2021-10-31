import services from './services'

export const studentSignUp = async (req, res) => {
  try {
    const error = await services.validateStudentSignUp(req)
    if (error) {
      return res.status(400).send(error.err)
    }

    const result = await services.studentSignUp(req) // store into database
    if (result.err) {
      return res.status(400).send(result.err)
    }
    // result will contain JWT token on successful sign-up
    return res.status(200).send(result)
  } catch (err) {
    return res
      .status(400)
      .send('Failed to sign-up. Check your details and try again later.')
  }
}

export const volunteerSignUp = async (req, res) => {
  try {
    const error = await services.validateVolunteerSignUp(req)
    if (error) {
      return res.status(400).send(error.err)
    }

    const result = await services.volunteerSignUp(req) // store into database
    if (result.err) {
      return res.status(400).send(result.err)
    }
    // result will contain JWT token on successful sign-up
    return res.status(200).send(result)
  } catch (err) {
    return res
      .status(400)
      .send('Failed to sign-up. Check your details and try again later.')
  }
}

export const signIn = async (req, res) => {
  try {
    const result = await services.signIn(req) // store into database
    if (result.err) {
      return res.status(401).send(result.err)
    }
    // result will contain JWT token on successful sign-in
    return res.status(200).send(result)
  } catch (err) {
    return res.status(401).send('Wrong email and/or password.')
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const result = await services.forgotPassword(req, res)
    if (result.err) {
      res.status(500).send(result.err)
    }
    return res.status(200).send(result)
  } catch (err) {
    return res.status(401).send('Wrong credentials.')
  }
}

export const resetPassword = async (req, res) => {
  try {
    const result = await services.resetPassword(req, res)
    if (result.err) {
      res.status(500).send(result.err)
    }
    return res.status(200).send(result)
  } catch (err) {
    return res.status(401).send('Wrong credentials.')
  }
}
