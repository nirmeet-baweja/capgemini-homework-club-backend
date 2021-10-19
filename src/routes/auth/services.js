import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import knex from '../../knex'
import config from '../../config'

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

const generateAccessToken = (email) =>
  jwt.sign(email, config.tokenSecret, { expiresIn: '1hr' })

/* *************************************************************** */

const signIn = async (req) => {
  const { email, password } = req.body
  const user = await knex('users')
    .first('id', 'email', 'password', 'role_id as roleId')
    .where('email', email)
    .orderBy('id')

  if (!user) {
    console.log(`No such user found: ${email}`)
    throw new Error('Wrong email and/or password.')
  } else {
    const validPass = await bcrypt.compare(password, user.password)
    if (validPass) {
      const token = generateAccessToken(user)
      return token
    }
    console.log(`Incorrect password for user: ${email}`)
    throw new Error('Wrong username and/or password.')
  }
}

const validateStudentSignUp = async (req) => {
  const { firstName, lastName, password, email, roleId, cohortId } = req.body

  if (!isValidName(firstName) || !isValidName(lastName)) {
    return { message: 'Enter a valid name. Name cannot be empty' }
  }

  if (!isValidEmail(email)) {
    return { message: 'Enter a valid email address.' }
  }

  if (!isValidPassword(password)) {
    return {
      message:
        'Password should include one lowercase letter, one uppercase letter, one numeric value and one special character (@$!%*#?&) and must be longer than 8 characters.',
    }
  }

  if (roleId !== studentRoleId) {
    return { message: 'The given role does not exist. Enter a valid role.' }
  }

  const isCohortValid = await isValidCohort(cohortId)

  if (!isCohortValid) {
    return { message: 'The given cohort does not exist. Enter a valid cohort.' }
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

  const [createdUser] = await knex('users')
    .select('id', 'email', 'password', 'role_id as roleId')
    .where('id', userId)

  if (createdUser) {
    return signIn(req)
  }

  throw new Error('Please check your details and try again.')
}

const validateVolunteerSignUp = async (req) => {
  const { firstName, lastName, password, email, roleId, skills } = req.body

  if (!isValidName(firstName) || !isValidName(lastName)) {
    return { message: 'Enter a valid name. Name cannot be empty' }
  }

  if (!isValidEmail(email)) {
    return { message: 'Enter a valid email address.' }
  }

  if (!isValidPassword(password)) {
    return {
      message:
        'Password should include one lowercase letter, one uppercase letter, one numeric value and one special character (@$!%*#?&) and must be longer than 8 characters.',
    }
  }

  if (roleId !== volunteerRoleId) {
    return { message: 'The given role does not exist. Enter a valid role.' }
  }

  const areSkillsValid = await areValidSkills(skills)

  if (!areSkillsValid) {
    return {
      message:
        'The list of skills contains an invalid value. Check and try again.',
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

  const [createdUser] = await knex('users')
    .select('id', 'email', 'password', 'role_id as roleId')
    .where('id', userId)

  if (createdUser) {
    return signIn(req)
  }

  throw new Error('Please check your details and try again.')
}

const verifyToken = (req, res) => {
  const token = req.headers.authorization.split(' ')[1]
  jwt.verify(token, config.tokenSecret, (error, decodedToken) => {
    if (error) {
      res.status(401).json({
        message: 'Unauthorized Access!',
      })
    } else {
      res.status(200).json({
        email: decodedToken.email,
        password: decodedToken.password,
      })
    }
  })
}

export default {
  validateStudentSignUp,
  studentSignUp,
  validateVolunteerSignUp,
  volunteerSignUp,
  signIn,
  verifyToken,
}
