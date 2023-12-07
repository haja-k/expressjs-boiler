const appRoot = require('app-root-path')
const logger = require(`${appRoot}/src/plugins/logger`)
const { redisClient } = require(`${appRoot}/src/config/redis`)
const moment = require('moment-timezone')
const util = require('util')
const redisGetAsync = util.promisify(redisClient.get).bind(redisClient)

function parseSessionData (sessionData) {
  const sessionObject = JSON.parse(sessionData)
  if (sessionObject && sessionObject.user && sessionObject.roleID) {
    const dateStr = sessionObject.cookie.expires
    const klDateTime = moment.tz(dateStr, 'Asia/Kuala_Lumpur')
    const klFormattedDateTime = klDateTime.format('DD-MM-YYYY HH:mm:ss')
    console.log(sessionObject)
    return {
      success: true,
      userID: sessionObject.userID,
      user: sessionObject.user,
      userRole: sessionObject.roleID,
      sessionExpiration: klFormattedDateTime
    }
  } else {
    return { success: false }
  }
}

async function getSessionData (req) {
  try {
    const sessionData = await redisGetAsync(`sess:${req.sessionID}`)

    if (!sessionData) {
      return { success: false }
    }

    const userSession = parseSessionData(sessionData)
    return userSession
  } catch (error) {
    logger.error(error)
    return { success: false }
  }
}

module.exports = {
  getSessionData
}
