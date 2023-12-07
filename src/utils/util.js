const appRoot = require('app-root-path')
const path = require('path')
const moment = require('moment-timezone')
const logger = require(`${appRoot}/src/plugins/logger`)
const filePath = `${appRoot}/src/config/messages.json`

const messenger = require(`${appRoot}/src/helper/messenger`)
const process = require(`${appRoot}/src/helper/process`)
const finder = require(`${appRoot}/src/helper/finder`)
const redis = require(`${appRoot}/src/helper/redis`)
const ldap = require(`${appRoot}/src/helper/ldap`)
const bcrypt = require(`${appRoot}/src/helper/bcrypt`)

const authenticate = require(`${appRoot}/src/middleware/authenticate`)
const restrictAccess = require(`${appRoot}/src/middleware/restrictAccess`)
const updateActivityTimestamp = require(`${appRoot}/src/middleware/activityTimestamp`)

const database = require(`${appRoot}/src/sequelize/models`)
const usersSvc = require(`${appRoot}/src/services/UserServices`)

module.exports = {
  path,
  moment,
  logger,
  messenger,
  filePath,
  process,
  finder,
  redis,
  ldap,
  bcrypt,
  authenticate,
  restrictAccess,
  updateActivityTimestamp,
  database,
  usersSvc
}
