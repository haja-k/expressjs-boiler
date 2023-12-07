const appRoot = require('app-root-path')
const usersSvc = require(`${appRoot}/src/services/UserServices`)
const { send } = require(`${appRoot}/src/utils/serve`)
const { path, logger, messenger, filePath, finder, process } = require(`${appRoot}/src/utils/util`)
const fileName = __filename.split(path.sep).pop()
const directory = __dirname.split(path.sep).pop()
const bcrypt = require(`${appRoot}/src/helper/bcrypt`)
const CronJobManager = require(`${appRoot}/src/helper/croner`)

const self = (module.exports = {
  changePassword: async (req, res) => {
    try {
      const { email, oldPassword, newPassword } = req.body

      if (!email || !newPassword) {
        logger.error(`[${directory}/${fileName}/changePassword] ${messenger(filePath, 'logIncompleteForm')}`)
        return send(res, false, messenger(filePath, 'incompleteForm'), 401)
      }
      const username = process.usernameExtraction(email).data
      const userValidity = await usersSvc.getAccValidity(username)
      if (userValidity === false) {
        return send(res, false, messenger(filePath, 'msgUserInvalid'), 403)
      }
      const getUserData = await finder.getUserData(username)
      if (getUserData.error) {
        return send(res, false, getUserData.message, 404)
      }
      let newPasswordHashed = null
      const userData = getUserData.data
      newPasswordHashed = await bcrypt.getHash(newPassword)
      const changePasswordResult = await self._compareAndChangePassword(
        res,
        userData,
        oldPassword,
        newPasswordHashed,
        newPassword
      )
      return changePasswordResult
    } catch (error) {
      logger.error(`[${directory}/${fileName}/changePassword] ${error}`)
      return send(res, false, messenger(filePath, 'internalError'), 500)
    }
  },

  _compareAndChangePassword: async (res, userData, oldPassword, newPasswordHashed, newPassword) => {
    if (userData.password !== null) {
      const oldPassCheck = await bcrypt.compareHash(oldPassword, userData.password)
      const samePassCheck = await bcrypt.compareHash(newPassword, userData.password)
      if (!oldPassCheck) { // if old password doesn't match
        return send(res, false, messenger(filePath, 'msgPassChangeFail'), 400)
      } else if (samePassCheck) { // if old password and new password match
        return send(res, false, messenger(filePath, 'msgSameAsOldPwd'), 400)
      } else { // if old password and new password different
        return self._changePasswordSvc(res, userData, newPasswordHashed, filePath)
      }
    } else {
      return self._changePasswordSvc(res, userData, newPasswordHashed, filePath)
    }
  },

  _changePasswordSvc: async (res, userData, newPasswordHashed) => {
    const passChange = await usersSvc.changePassword(userData.id, newPasswordHashed)
    if (passChange.error === false) {
      const message = messenger(filePath, 'msgPassChangeSuccess')
      logger.info(`[${directory}/${fileName}/_changePasswordSvc] ${message}`)
      return send(res, true, message, 200)
    } else {
      logger.error(`[${directory}/${fileName}/_changePasswordSvc] ${passChange.message}`)
      return send(res, false, messenger(filePath, 'msgPassChangeFail'), 400)
    }
  },

  generateToken: async (req, res) => {
    const { email } = req.body
    const username = process.usernameExtraction(email).data
    const userValidity = await usersSvc.getAccValidity(username)
    if (!email) {
      return send(res, false, messenger(filePath, 'incompleteForm'), 400)
    }
    if (userValidity === null | userValidity === false) {
      return send(res, false, messenger(filePath, 'msgUserInvalid'), 403)
    }
    try {
      logger.info(`[${directory}/${fileName}/generateToken] Generating token`)
      const token = process.generateUniqueKey()
      const recordToken = await usersSvc.updateToken(token, email)
      if (recordToken) {
        console.log('SEND EMAIL TO USER CODE HERE')
        const data = { token, email }
        const cronManager = new CronJobManager()
        cronManager.startCronJob('*/5 * * * *', data)
      }
      const tokenString = {
        token
      }
      return send(res, true, 'Token generated & email sent', 200, tokenString)
    } catch (error) {
      logger.error(`[${directory}/${fileName}/generateToken] ${error}`)
      return send(res, false, messenger(filePath, 'internalError'), 500)
    }
  },

  resetPasswordWithTokenVerification: async (req, res) => {
    const { newPassword } = req.body
    const { token } = req.query
    if (!token | !newPassword) {
      return send(res, false, messenger(filePath, 'incompleteForm'), 400)
    }
    try {
      logger.info(`[${directory}/${fileName}/resetPasswordWithTokenVerification] Generating token`)
      const recordToken = await usersSvc.compareToken(token)
      console.log('🚀 ~ file: userCtrl.js:112 ~ resetPasswordWithTokenVerification: ~ recordToken:', recordToken)
      if (recordToken.success === true) {
        let newPasswordHashed = null
        newPasswordHashed = await bcrypt.getHash(newPassword)
        const changeUserPassword = await usersSvc.resetPassword(recordToken.data, newPasswordHashed)
        if (changeUserPassword) {
          await usersSvc.deleteToken(token, recordToken.data)
          return send(res, true, 'Password reset success.', 200)
        } else {
          return send(res, false, 'Password reset failed.', 401)
        }
      } else {
        return send(res, false, 'Password reset failed. Token invalid.', 401)
      }
    } catch (error) {
      logger.error(`[${directory}/${fileName}/resetPasswordWithTokenVerification] ${error}`)
      return send(res, false, messenger(filePath, 'internalError'), 500)
    }
  }
})
