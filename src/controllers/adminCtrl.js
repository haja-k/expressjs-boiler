const appRoot = require('app-root-path')
const usersSvc = require(`${appRoot}/src/services/UserServices`)
const { send } = require(`${appRoot}/src/utils/serve`)
const { path, logger, messenger, filePath, finder, process } = require(`${appRoot}/src/utils/util`)
const fileName = __filename.split(path.sep).pop()
const directory = __dirname.split(path.sep).pop()

module.exports = {
  internalRegister: async (req, res) => {
    try {
      const { email, fullName, loginType } = req.body
      const username = process.usernameExtraction(email).data
      const findUser = await finder.checkUserPresence(username)
      if (findUser.error) {
        const register = await usersSvc.addUser(username, email, fullName, loginType)
        logger.info(`[${directory}/${fileName}/userRegistration] ${messenger(filePath, 'logUserReg')}`)
        const response = {
          success: true,
          message: messenger(filePath, 'msgUserRegSuccess'),
          data: register.dataValues
        }
        return response
      }
      logger.error(`[${directory}/${fileName}/userRegistration] ${findUser.message}`)
      const response = {
        success: false,
        message: messenger(filePath, 'msgUserAlreadyReg')
      }
      return response
    } catch (error) {
      const message = messenger(filePath, 'logUserRegError')
      logger.error(`[${directory}/${fileName}/userRegistration] ${message} - ${error}`)
      const response = {
        success: false,
        message
      }
      return response
    }
  },
  userRegistration: async (req, res) => {
    try {
      const { email, fullName, loginType } = req.body

      if (!email || !fullName || !process.isValidEmail(email)) {
        logger.error(`[${directory}/${fileName}/userRegistration] ${messenger(filePath, 'logIncompleteForm')}`)
        return send(res, false, messenger(filePath, 'incompleteForm'), 401)
      }
      const username = process.usernameExtraction(email).data
      const findUser = await finder.checkUserPresence(username)
      if (findUser.error) {
        await usersSvc.addUser(username, email, fullName, loginType)
        logger.info(`[${directory}/${fileName}/userRegistration] ${messenger(filePath, 'logUserReg')}`)
        return send(res, true, messenger(filePath, 'msgUserRegSuccess'), 200)
      }
      logger.error(`[${directory}/${fileName}/userRegistration] ${findUser.message}`)
      return send(res, false, messenger(filePath, 'msgUserAlreadyReg'), 400)
    } catch (error) {
      const message = messenger(filePath, 'logUserRegError')
      logger.error(`[${directory}/${fileName}/userRegistration] ${message} - ${error}`)
      return send(res, false, message, 500)
    }
  }
}
