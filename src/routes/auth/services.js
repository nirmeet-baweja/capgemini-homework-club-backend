import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import knex from '../../knex'
import config from '../../config'

const sgMail = require('@sendgrid/mail')

const saltRounds = 10
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

function filterBy(filter) {
  return knex('users').where(filter)
}

// same here, looking into 'users' table by 'id' and then updating the values
function update(id, changes) {
  return knex('users').where({ id }).update(changes)
}
function sendEmail(user, token) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  console.log(token)
  console.log(`${process.env.clientURL}/reset-password/${token}`)
  const msg = {
    to: user.email,
    from: 'debby21@mail.com', // your email
    subject: 'Reset password requested',
    html: `
       <a href="${process.env.clientURL}/reset-password/${token}">${token}</a>
     `,
  }

  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      // Log friendly error
      console.error(error.toString())
    })
}
/* *************************************************************** */

const signIn = async (req) => {
  const { email, password } = req.body
  const [user] = await knex('users as u')
    .join('roles as r', 'r.id', 'u.role_id')
    .select('u.id as userId', 'u.email', 'u.password', 'r.name as role')
    .where('u.email', email)
    .orderBy('u.id')

  if (!user) {
    return { err: 'Wrong email and/or password.' }
  }
  console.log(password, user.password)
  const validPass = await bcrypt.compare(password, user.password)
  if (validPass) {
    const { userId, role } = user
    return { token: generateAccessToken({ userId, email, role }) }
  }
  return { err: 'Wrong user.' }
}

const validateStudentSignUp = async (req) => {
  const { firstName, lastName, password, email, roleId, cohortId } = req.body

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

  if (roleId !== studentRoleId) {
    return { err: 'The given role does not exist. Enter a valid role.' }
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
    role_id: req.body.roleId,
    cohort_id: req.body.cohortId,
  }

  const [userId] = await knex('users').insert(user, 'id')

  const [createdUser] = await knex('users as u')
    .select('u.id as userId', 'u.email', 'r.name as role')
    .join('roles as r', 'r.id', 'u.role_id')
    .where('u.id', userId)

  // login the user after sign-up is complete
  if (createdUser) {
    return { token: generateAccessToken(createdUser) }
  }
  return { err: 'Please check your details and try again.' }
}

const validateVolunteerSignUp = async (req) => {
  const { firstName, lastName, password, email, roleId, skills } = req.body

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

  if (roleId !== volunteerRoleId) {
    return { err: 'The given role does not exist. Enter a valid role.' }
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
    role_id: req.body.roleId,
    cohort_id: null,
  }

  const [userId] = await knex('users').insert(user, 'id')

  const userSkills = skills.map((skill) => ({
    user_id: userId,
    skill_id: skill,
  }))
  await knex('user_skills').insert(userSkills)

  const [createdUser] = await knex('users as u')
    .select('u.id as userId', 'u.email', 'r.name as role')
    .join('roles as r', 'r.id', 'u.role_id')
    .where('u.id', userId)

  // login the user after sign-up is complete
  if (createdUser) {
    return { token: generateAccessToken(createdUser) }
  }
  return { err: 'Please check your details and try again.' }
}

// forgot password

const forgotPassword = async (req, res) => {
  const { email } = req.body

  try {
    // look for email in database
    const [user] = await filterBy({ email })
    // if there is no user send back an error
    if (!user) {
      res.status(404).json({ error: 'Invalid email' })
    } else {
      // otherwise we need to create a temporary token that expires in 10 mins
      const resetLink = jwt.sign({ user: user.email }, config.tokenSecret, {
        expiresIn: '10m',
      })
      // update resetLink property to be the temporary token and then send email
      await update(user.id, { resetLink })
      console.log(res)
      // we'll define this function below
      sendEmail(user, resetLink)

      res.status(200).json({ message: 'Check your email' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
// password token
const resetPassword = async (req, res) => {
  // Get the token from params
  const resetLink = req.params.token
  const newPassword = req.body

  // if there is a token we need to decode and check for no errors
  if (resetLink) {
    jwt.verify(resetLink, config.tokenSecret, (error) => {
      if (error) {
        res.status(500).json({ message: 'Incorrect token or expired' })
      }
    })
  }

  try {
    // find user by the temporary token we stored earlier
    const [user] = await filterBy({ resetLink })

    // if there is no user, send back an error
    if (!user) {
      return res
        .status(400)
        .json({ message: 'We could not find a match for this link' })
    }

    // otherwise we need to hash the new password  before saving it in the database
    const hashPassword = await bcrypt.hash(newPassword.password, saltRounds)
    newPassword.password = hashPassword

    // update user credentials and remove the temporary link from database before saving
    const updatedCredentials = {
      password: hashPassword,
      resetLink: null,
    }

    await update(user.id, updatedCredentials)

    return res.status(200).json({ message: 'Password updated' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
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
