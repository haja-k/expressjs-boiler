const express = require('express')
const router = express.Router()
const appRoot = require('app-root-path')
const adminCtrl = require(`${appRoot}/src/controllers/adminCtrl`)
const { path, logger, messenger, filePath, authenticate, restrictAccess } = require(`${appRoot}/src/utils/util`)
const fileName = __filename.split(path.sep).pop()
const directory = __dirname.split(require('path').sep).pop()

router.use(authenticate)
router.use(restrictAccess([2]))

router.post('/register-user', async (req, res) => {
  /**
    #swagger.tags = [{ "admin" }]
    #swagger.description = "User Creation"
    #swagger.parameters['profile'] = {
      in: 'body',
      required: true,
      schema: {
        email: "rni@sains.com.my",
        fullName: "Research & Innovation ",
      }
    }
    #swagger.responses['200'] = { description: "API call is successful" }
    #swagger.responses['500'] = { description: "Server Error" }
  */
  try {
    req.body.loginType = 'direct'
    const registeringNewUser = await adminCtrl.userRegistration(req, res)
    return registeringNewUser
  } catch (error) {
    logger.error(`[${directory}/${fileName}/register-user] ${error}`)
    return res.status(500).send(messenger(filePath, 'internalError'))
  }
})

module.exports = router
