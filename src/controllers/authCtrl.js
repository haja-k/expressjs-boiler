const appRoot = require('app-root-path')
const adminCtrl = require(`${appRoot}/src/controllers/adminCtrl`)
const { path, logger, ldap, bcrypt, messenger, filePath, finder, process, redis, usersSvc } = require(`${appRoot}/src/utils/util`)
const { send } = require(`${appRoot}/src/utils/serve`)
const fileName = __filename.split(path.sep).pop()
const directory = __dirname.split(require('path').sep).pop()

const self = (module.exports = {
  initMessage: async (req, res) => {
    try {
      const message = messenger(filePath, 'healthyAPI')
      logger.info(`[${directory}/${fileName}/initMessage] ${message}`)
      return send(res, true, message, 200)
    } catch (error) {
      const message = messenger(filePath, 'unhealthyAPI') + error
      logger.error(`[${directory}/${fileName}/initMessage] ${message}`)
      return send(res, false, message, 500)
    }
  },
  userLogin: async (req, res) => {
    try {
      const { email, password } = req.body
      if (!email) {
        logger.error(`[${directory}/${fileName}/userLogin] ${messenger(filePath, 'logIncompleteForm')}`)
        return send(res, false, messenger(filePath, 'incompleteForm'), 401)
      }
      const username = process.usernameExtraction(email).data
      ldap.init()
      const ldapUser = await ldap.authenticate(username, password)
      ldap.close()
      if (ldapUser.error) {
        const noUserStr = 'no such user'
        const noPwdStr = 'no password given'
        const mainString = ldapUser.message
        if (mainString.includes(noUserStr) || mainString.includes(noPwdStr)) {
          const dbAuthenticationResult = await self._dbLogin(req, res)
          return dbAuthenticationResult
        } else {
          return send(res, false, ldapUser.message, 404)
        }
      } else {
        logger.info(`[${directory}/${fileName}/userLogin] Authentication passed for LDAP user: ${ldapUser.sn}`)
        const userValidity = await usersSvc.getAccValidity(username)
        console.log(userValidity)
        if (userValidity === false) {
          return send(res, false, messenger(filePath, 'msgUserInvalid'), 403)
        } else {
          const checkUserPresence = await finder.getUserData(username)
          if (checkUserPresence.error) {
            try {
              req.body.fullName = ldapUser.sn
              req.body.loginType = 'ldap'
              const registeringNewUser = await adminCtrl.internalRegister(req, res)
              if (registeringNewUser.success === false) {
                logger.info(`[${directory}/${fileName}/userLogin] ${registeringNewUser.message}`)
                return send(res, false, messenger(filePath, 'msgUserAutoRegError'), 403)
              } else {
                logger.info(`[${directory}/${fileName}/userLogin] ${registeringNewUser.message} - ${req.body.fullName}`)
                const userProfile = {
                  username,
                  email,
                  full_name: ldapUser.sn
                }
                req.session.userID = registeringNewUser.data.id
                req.session.user = username
                req.session.roleID = 3
                return send(res, true, messenger(filePath, 'authenticationPassedAndAccCreated'), 200, userProfile)
              }
            } catch (error) {
              logger.error(`[${directory}/${fileName}/userLogin] ${error}`)
              return send(res, false, `${error}`, 500)
            }
          } else {
            logger.info(`[${directory}/${fileName}/userLogin] Logging in user with existing account - ${req.body.fullName}`)
            const userProfile = {
              username: checkUserPresence.data.username,
              email: checkUserPresence.data.email,
              full_name: checkUserPresence.data.full_name,
              role_id: checkUserPresence.data.role_id
            }
            await finder.updateLoginTime(checkUserPresence.data.username)
            req.session.userID = checkUserPresence.data.id
            req.session.user = userProfile.username
            req.session.roleID = userProfile.role_id
            console.log(' ------[USER SESSION CHECK]------ ')
            console.log(req.session)
            return send(res, true, messenger(filePath, 'authenticationPassed'), 200, userProfile)
          }
        }
      }
    } catch (e) {
      logger.error(`[${directory}/${fileName}/userLogin] Authentication error with LDAP: ${e}. Executing db authentication...`)
      return send(res, false, `${e}`, 500)
    }
  },
  _dbLogin: async (req, res) => {
    try {
      const { email, password } = req.body
      const username = process.usernameExtraction(email).data
      const checkUserPresence = await finder.checkUserPresence(username)
      if (checkUserPresence.error) {
        return send(res, false, messenger(filePath, 'userLoginNotFound'), 401)
      }
      const userValidity = await usersSvc.getAccValidity(username)
      if (userValidity === false) {
        return send(res, false, messenger(filePath, 'msgUserInvalid'), 403)
      }
      const userData = await finder.getUserData(username, email)
      if (userData.error) {
        return send(res, false, userData.message, 404)
      }
      switch (userData.data.password) {
        case null:
          /* eslint-disable */
          const message = messenger(filePath, 'msgPwdUnset')
          /* eslint-enable */
          logger.info(`[${directory}/${fileName}/_dbLogin] ${message} (${username})`)
          return send(res, false, message, 403)

        default:
          /* eslint-disable */
          const passwordMatch = await bcrypt.compareHash(password, userData.data.password)
          /* eslint-enable */
          if (passwordMatch) {
            logger.info(`[${directory}/${fileName}/_dbLogin] ${messenger(filePath, 'logPwdHashMatch')} ${username}`)
            const userProfile = {
              username: userData.data.username,
              email: userData.data.email,
              full_name: userData.data.full_name,
              role_id: userData.data.role_id
            }
            await finder.updateLoginTime(userData.data.username)
            req.session.userID = userData.data.id
            req.session.user = userProfile.username
            req.session.roleID = userProfile.role_id
            return send(res, true, messenger(filePath, 'authenticationPassed'), 200, userProfile)
          } else {
            logger.info(`[${directory}/${fileName}/_dbLogin] ${messenger(filePath, 'logPwdHashNotMatch')} ${username}`)
            return send(res, false, messenger(filePath, 'invalidPassword'), 403)
          }
      }
    } catch (e) {
      return send(res, false, process.userLoginError(e), 500)
    }
  },
  userSession: async (req, res) => {
    try {
      const getUserSession = await redis.getSessionData(req)
      if (getUserSession.success) {
        logger.info(`[${directory}/${fileName}/userSession] Session for ${getUserSession.user} retrieved`)
        const userSession = {
          success: true,
          user: getUserSession.user,
          userRole: getUserSession.userRole,
          sessionExpiration: getUserSession.sessionExpiration
        }
        return send(res, true, messenger(filePath, 'msgUserSessionValid'), 200, userSession)
      } else {
        logger.error(`[${directory}/${fileName}/userSession] Session for ${getUserSession.user} unable to retrieved`)
        return send(res, false, messenger(filePath, 'msgUserSessionInvalid'), 404)
      }
    } catch (error) {
      logger.error(`[${directory}/${fileName}/userSession] ${error}`)
      return send(res, false, messenger(filePath, 'internalError'), 500)
    }
  },
  userLogout: async (req, res) => {
    try {
      const username = req.session.user
      console.log(' ------[USER SESSION CHECK]------ ')
      console.log(req.session)
      req.session.destroy((err) => {
        if (err) {
          logger.error(`[${directory}/${fileName}/userLogout] Error destroying session: ${err}`)
          return send(res, false, messenger(filePath, 'msgLogOutError'), 500)
        } else {
          logger.info(`[${directory}/${fileName}/userLogout] ${username} is logged out`)
          return send(res, true, `${username.toUpperCase()} is logged out successfully.`, 200)
        }
      })
    } catch (error) {
      logger.error(`[${directory}/${fileName}/userLogout] ${error}`)
      return send(res, false, messenger(filePath, 'internalError'), 500)
    }
  }

})
