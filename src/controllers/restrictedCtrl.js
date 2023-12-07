const appRoot = require('app-root-path')
const roleSvc = require(`${appRoot}/src/services/RoleServices`)
const { path, logger, messenger, filePath, finder, process, usersSvc } = require(`${appRoot}/src/utils/util`)
const { send } = require(`${appRoot}/src/utils/serve`)
const fileName = __filename.split(path.sep).pop()
const directory = __dirname.split(path.sep).pop()

module.exports = {
  updateUserRole: async (req, res) => {
    const { userID, roleAssigned } = req.body
    if (!userID || !roleAssigned) {
      logger.error(`[${directory}/${fileName}/updateUserRole] ${messenger(filePath, 'logIncompleteForm')}`)
      return send(res, false, messenger(filePath, 'incompleteForm'), 401)
    }

    const getUserName = await usersSvc.getUserDataByID(userID)
    if (getUserName === null) {
      return send(res, false, messenger(filePath, 'msgUserInvalid'), 403)
    }
    const userValidity = await usersSvc.getAccValidity(getUserName.username)
    if (userValidity === false) {
      return send(res, false, messenger(filePath, 'msgUserInvalid'), 403)
    }
    try {
      const checkRole = await roleSvc.sameRoleCheck(getUserName.email, roleAssigned)
      if (checkRole) {
        const unchangedRoleMessage = messenger(filePath, 'roleUnchanged') + roleAssigned.toUpperCase()
        logger.error(`[${directory}/${fileName}/updateUserRole] ${unchangedRoleMessage} (${getUserName.email})`)
        return send(res, false, unchangedRoleMessage, 400)
      }
      await roleSvc.updateUserRole(getUserName.email, roleAssigned)
      const roleUpdatedMessage = messenger(filePath, 'roleUpdated') + ' ' + roleAssigned
      logger.info(`[${directory}/${fileName}/updateUserRole] ${roleUpdatedMessage} (${getUserName.email})`)
      return send(res, true, roleUpdatedMessage, 200)
    } catch (error) {
      const errorMessage = error.message || 'internalError'
      logger.error(`[${directory}/${fileName}/updateUserRole] ${error}`)
      return send(res, false, messenger(filePath, errorMessage), 500)
    }
  },

  deactivateUserAccount: async (req, res) => {
    const { email } = req.body

    if (!email || !process.isValidEmail(email)) {
      logger.error(`[${directory}/${fileName}/deactivateUserAccount] ${messenger(filePath, 'logIncompleteForm')}`)
      const response = {
        success: false,
        message: messenger(filePath, 'incompleteForm')
      }
      res.status(401).json(response)
    }

    try {
      const username = process.usernameExtraction(email).data
      const checkUserPresence = await finder.getUserData(username)
      if (checkUserPresence.error) {
        return res.status(404).json({ success: false, message: checkUserPresence.message })
      }

      if (!checkUserPresence.data.is_active) {
        const userNotDeactivatedMsg = checkUserPresence.data.username.toUpperCase() + messenger(filePath, 'msgUserNotDeleted')
        logger.error(`[${directory}/${fileName}/deactivateUserAccount] ${userNotDeactivatedMsg}`)
        return res.status(400).json({ success: false, message: userNotDeactivatedMsg })
      }

      const delUser = await usersSvc.deactivateUser(email)
      console.log(delUser)

      const userDeactivatedMsg = checkUserPresence.data.username.toUpperCase() + messenger(filePath, 'msgUserDeleted')
      logger.info(`[${directory}/${fileName}/deactivateUserAccount] ${userDeactivatedMsg} (${email})`)
      return res.status(200).json({ success: true, message: userDeactivatedMsg })
    } catch (error) {
      logger.error(`[${directory}/${fileName}/deactivateUserAccount] ${error}`)
      const response = {
        success: false,
        message: messenger(filePath, 'internalError')
      }
      res.status(500).json(response)
    }
  }
}
