const express = require('express')
const router = express.Router()
const appRoot = require('app-root-path')
const userCtrl = require(`${appRoot}/src/controllers/userCtrl`)
const { path, logger, messenger, filePath, authenticate, restrictAccess } = require(`${appRoot}/src/utils/util`)
const fileName = __filename.split(path.sep).pop()
const directory = __dirname.split(require('path').sep).pop()

router.put('/change-password', async (req, res) => {
  /**
    #swagger.tags = [{ "user" }]
    #swagger.description = "Change Account Password"
    #swagger.parameters['password'] = {
      in: 'body',
      required: false,
      schema: {
        email: "dwightschrute@sains.com.my",
        oldPassword: "coolwaterbottle",
        newPassword: "waterbottleisnecessary",
      }
    }
    #swagger.responses['200'] = { description: "API call is successful" }
    #swagger.responses['500'] = { description: "Server Error" }
  */
  try {
    const changePassword = await userCtrl.changePassword(req, res)
    return changePassword
    // res.status(200).send(changePassword)
  } catch (error) {
    logger.error(`[${directory}/${fileName}/change-password] ${error}`)
    res.status(500).send(messenger(filePath, 'internalError'))
  }
})

router.put('/generate-token', async (req, res) => {
  /**
    #swagger.tags = [{ "user" }]
    #swagger.description = "Generate Token"
    #swagger.parameters['email'] = {
      in: 'body',
      required: false,
      schema: {
        email: "dwightschrute@sains.com.my"
      }
    }
    #swagger.responses['200'] = { description: "API call is successful" }
    #swagger.responses['500'] = { description: "Server Error" }
  */
  try {
    const getToken = await userCtrl.generateToken(req, res)
    return getToken
  } catch (error) {
    logger.error(`[${directory}/${fileName}/generate-token] ${error}`)
    res.status(500).send(messenger(filePath, 'internalError'))
  }
})

router.put('/reset-password', async (req, res) => {
  /**
    #swagger.tags = [{ "user" }]
    #swagger.description = "Reset Password With Token"
    #swagger.parameters['token'] = {
      in: 'query',
      required: false,
      schema: {
        token: "911202315410-hfSWQG"
      }
    }
    #swagger.parameters['password'] = {
      in: 'body',
      required: false,
      schema: {
        newPassword: "newpasswordforDwight",
      }
    }
    #swagger.responses['200'] = { description: "API call is successful" }
    #swagger.responses['500'] = { description: "Server Error" }
  */
  try {
    const getPassword = await userCtrl.resetPasswordWithTokenVerification(req, res)
    return getPassword
  } catch (error) {
    logger.error(`[${directory}/${fileName}/reset-password] ${error}`)
    res.status(500).send(messenger(filePath, 'internalError'))
  }
})

router.use(authenticate)
router.use(restrictAccess([3]))

module.exports = router
