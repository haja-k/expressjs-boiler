const fs = require('fs')
const appRoot = require('app-root-path')
const logger = require(`${appRoot}/src/plugins/logger`)

function getMessageFromJSON (filePath, key) {
  try {
    const messagesData = fs.readFileSync(filePath, 'utf8')
    const messages = JSON.parse(messagesData)
    return messages[key] || 'Default message if key is not found'
  } catch (error) {
    logger.error('Error reading messages file:', error)
    return 'Error: Unable to retrieve the message'
  }
}

module.exports = getMessageFromJSON
