import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import sgMail from '@sendgrid/mail'
import knex from '../../knex'
import config from '../../config'

const saltRounds = 2
const studentRoleId = 3
const volunteerRoleId = 2

/* *************************************************************** */
/* Helper functions */

const isValidName = (name) => {
  if (!name || name === '') {
    return false
  }
  return true
}

const isValidEmail = (email) => {
  const re =
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

const isValidPassword = (password) => {
  const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
  return re.test(password)
}

const isValidCohort = async (cohortId) => {
  const cohorts = await knex('cohorts').select('id').where('is_active', true)
  const cohortIds = cohorts.map((cohort) => cohort.id)
  return cohortIds.includes(cohortId)
}

const areValidSkills = async (volunteerSkills) => {
  const skills = await knex('skills').select('id').orderBy('id')
  const skillIds = skills.map((skill) => skill.id)

  const everyElement = volunteerSkills.every((volunteerSkill) =>
    skillIds.includes(volunteerSkill)
  )

  return everyElement
}

const generateAccessToken = (userDetails) =>
  jwt.sign(userDetails, config.tokenSecret, { expiresIn: '1hr' })

const filterBy = (filter) => knex('users').where(filter)

// same here, looking into 'users' table by 'id' and then updating the values
const update = (id, changes) => knex('users').where({ id }).update(changes)

const sendEmail = async (user, token) => {
  sgMail.setApiKey(config.sendGridKey)
  const msg = {
    to: user.email,
    from: config.email, // your email
    subject: 'Reset password requested',
    html: `

    <p>Hi ${user.firstname},</p>
    <p>You requested to reset your password.</p>
    <p> Please, click the link below to reset your password</p>
       <a href="${config.frontEndUrl}/reset-password/${token}">${token}</a>
     `,
  }
  try {
    await sgMail.send(msg)
    return undefined
  } catch (error) {
    console.error(error.toString())
    return 'An internal error occurred, unable to send the email.'
  }
}

/* *************************************************************** */

const signIn = async (req) => {
  const { email, password } = req.body
  const [user] = await knex('users as u')
    .join('roles as r', 'r.id', 'u.role_id')
    .select(
      'u.id as userId',
      'u.firstname as firstName',
      'u.last_name as lastName',
      'u.email',
      'u.password',
      'r.name as role'
    )
    .where('u.email', email)
    .orderBy('u.id')

  if (!user) {
    return { err: 'Wrong email and/or password.' }
  }
  const validPass = await bcrypt.compare(password, user.password)
  if (validPass) {
    const { userId, firstName, lastName, role } = user
    return {
      token: generateAccessToken({ userId, firstName, lastName, email, role }),
    }
  }
  return { err: 'Wrong email and/or password.' }
}

const validateStudentSignUp = async (req) => {
  const { firstName, lastName, password, email, cohortId } = req.body

  if (!isValidName(firstName) || !isValidName(lastName)) {
    return { err: 'Enter a valid name. Name cannot be empty' }
  }

  if (!isValidEmail(email)) {
    return { err: 'Enter a valid email address.' }
  }

  if (!isValidPassword(password)) {
    return {
      err: 'Password should include one lowercase letter, one uppercase letter, one numeric value and one special character (@$!%*#?&) and must be longer than 8 characters.',
    }
  }

  const isCohortValid = await isValidCohort(cohortId)

  if (!isCohortValid) {
    return { err: 'The given cohort does not exist. Enter a valid cohort.' }
  }

  return undefined
}

const studentSignUp = async (req) => {
  const hash = await bcrypt.hash(req.body.password, saltRounds)

  const user = {
    firstname: req.body.firstName,
    last_name: req.body.lastName,
    email: req.body.email,
    password: hash,
    role_id: studentRoleId,
    cohort_id: req.body.cohortId,
  }

  const [userId] = await knex('users').insert(user, 'id')

  const [createdUser] = await knex('users as u')
    .select(
      'u.id as userId',
      'u.firstname as firstName',
      'u.last_name as lastName',
      'u.email',
      'r.name as role'
    )
    .join('roles as r', 'r.id', 'u.role_id')
    .where('u.id', userId)

  // login the user after sign-up is complete
  if (createdUser) {
    return { token: generateAccessToken(createdUser) }
  }
  return { err: 'Please check your details and try again.' }
}

const validateVolunteerSignUp = async (req) => {
  const { firstName, lastName, password, email, skills } = req.body

  if (!isValidName(firstName) || !isValidName(lastName)) {
    return { err: 'Enter a valid name. Name cannot be empty' }
  }

  if (!isValidEmail(email)) {
    return { err: 'Enter a valid email address.' }
  }

  if (!isValidPassword(password)) {
    return {
      err: 'Password should include one lowercase letter, one uppercase letter, one numeric value and one special character (@$!%*#?&) and must be longer than 8 characters.',
    }
  }

  const areSkillsValid = await areValidSkills(skills)

  if (!areSkillsValid) {
    return {
      err: 'The list of skills contains an invalid value. Check and try again.',
    }
  }

  return undefined
}

const volunteerSignUp = async (req) => {
  const hash = await bcrypt.hash(req.body.password, saltRounds)
  const { skills } = req.body

  const user = {
    firstname: req.body.firstName,
    last_name: req.body.lastName,
    email: req.body.email,
    password: hash,
    role_id: volunteerRoleId,
    cohort_id: null,
  }

  const [userId] = await knex('users').insert(user, 'id')

  const userSkills = skills.map((skill) => ({
    user_id: userId,
    skill_id: skill,
  }))
  await knex('user_skills').insert(userSkills)

  const [createdUser] = await knex('users as u')
    .select(
      'u.id as userId',
      'u.firstname as firstName',
      'u.last_name as lastName',
      'u.email',
      'r.name as role'
    )
    .join('roles as r', 'r.id', 'u.role_id')
    .where('u.id', userId)

  // login the user after sign-up is complete
  if (createdUser) {
    return { token: generateAccessToken(createdUser) }
  }
  return { err: 'Please check your details and try again.' }
}

// forgot password
const forgotPassword = async (req) => {
  const { email } = req.body

  try {
    // look for email in database
    const [user] = await filterBy({ email })
    // if there is no user send back an error
    if (!user) {
      return { err: 'Invalid email.' }
    }
    // otherwise we need to create a temporary token that expires in 10 mins
    const resetLink = jwt.sign({ user: user.email }, config.tokenSecret, {
      expiresIn: '30m',
    })

    // update resetLink property to be the temporary token and then send email
    await update(user.id, { resetLink })

    const err = await sendEmail(user, resetLink)
    if (err) {
      return { err }
    }

    return {
      message:
        'We have sent you an email with reset password link, please check your email.',
    }
  } catch (error) {
    return { err: error.message }
  }
}

// password token
const resetPassword = async (req, res) => {
  // Get the token from params
  const resetLink = req.params.token
  const newPassword = req.body.password

  // if there is a token we need to decode and check for no errors
  if (resetLink) {
    jwt.verify(resetLink, config.tokenSecret, (err) => {
      if (err) {
        res.status(500).json({ message: 'Incorrect token or expired' })
      }
    })
  }

  try {
    // find user by the temporary token we stored earlier
    const [user] = await filterBy({ resetLink })

    // if there is no user, send back an error
    if (!user) {
      return { err: 'We could not find a match for this link' }
    }
    if (isValidPassword(newPassword)) {
      // otherwise we need to hash the new password  before saving it in the database
      const hashPassword = await bcrypt.hash(newPassword, saltRounds)

      // update user credentials and remove the temporary link from database before saving
      const updatedCredentials = {
        password: hashPassword,
        resetLink: null,
      }

      await update(user.id, updatedCredentials)

      return { message: 'Password updated successfully.' }
    }
    return {
      err: 'Password should include one lowercase letter, one uppercase letter, one numeric value and one special character (@$!%*#?&) and must be longer than 8 characters.',
    }
  } catch (error) {
    return { err: error.message }
  }
}

export default {
  validateStudentSignUp,
  studentSignUp,
  validateVolunteerSignUp,
  volunteerSignUp,
  signIn,
  forgotPassword,
  resetPassword,
}
