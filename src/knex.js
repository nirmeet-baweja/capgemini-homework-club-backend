// require('dotenv').config()
import config from './config'

const environment = config.env || 'development'
const configure = require('../knexfile')[environment]
module.exports = require('knex')(configure)
