const appRoot = require('app-root-path')
const logger = require(`${appRoot}/src/plugins/logger`)
const messenger = require(`${appRoot}/src/helper/messenger`)
const filePath = `${appRoot}/src/config/messages.json`
const path = require('path')
const fs = require('fs')
const directory = __dirname.split(require('path').sep).pop()

function usernameExtraction (email) {
  try {
    if (!email) {
      const message = messenger(filePath, 'emailRequired')
      throw new Error(message)
    }

    const username = email.includes('@') ? email.split('@')[0] : email

    return {
      error: false,
      data: username
    }
  } catch (error) {
    const message = messenger(filePath, 'nameExtractError') + ': ' + error.message
    logger.error(
      `[${directory}] ${message}`
    )
    return {
      error: true,
      message
    }
  }
}

function isValidEmail (email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function userLoginError (e) {
  logger.error(`[${directory}] ${e}`)
  const emptyUsername = 'empty username'
  const err = e.toString()
  if (err.includes(emptyUsername)) {
    return messenger(filePath, 'noUsernameORPassword')
  } else {
    return typeof e === 'object' ? e.name : e
  }
}

function deleteOldLogFiles (logDir) {
  try {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 60)
    const files = fs.readdirSync(logDir)
    files.forEach((file) => {
      if (file.match(/^\d{2}_\d{2}_\d{4}\.log$/)) {
        const fileDateParts = file.split('.')[0].split('_')
        const fileDate = new Date(`${fileDateParts[2]}-${fileDateParts[1]}-${fileDateParts[0]}`)
        if (fileDate < thirtyDaysAgo) {
          const filePath = path.join(logDir, file)
          fs.unlinkSync(filePath)
          logger.info(`[${directory}/deleteOldLogFiles] Deleted ${file} from ${logDir} which was created more than 30 days ago `)
        }
      }
    })
  } catch (error) {
    logger.error(`[${directory}/deleteOldLogFiles] Error in deleteOldLogFiles: ${error}`)
  }
}

function generateUniqueKey () {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const keyLength = 6
  let uniqueKey = ''
  for (let i = 0; i < keyLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    uniqueKey += characters.charAt(randomIndex)
  }
  const date = new Date()
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const timestamp = `${day}${month}${year}${hours}${minutes}${seconds}`
  const userToken = `${timestamp}-${uniqueKey}`
  return userToken
}

module.exports = {
  usernameExtraction,
  isValidEmail,
  userLoginError,
  deleteOldLogFiles,
  generateUniqueKey
}
