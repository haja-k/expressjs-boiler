const express = require('express')
const router = express.Router()
const appRoot = require('app-root-path')
const restrictedCtrl = require(`${appRoot}/src/controllers/restrictedCtrl`)
const { path, logger, messenger, filePath, authenticate, restrictAccess } = require(`${appRoot}/src/utils/util`)
const fileName = __filename.split(path.sep).pop()
const directory = __dirname.split(require('path').sep).pop()

router.use(authenticate)
router.use(restrictAccess([1]))

router.put('/update-role', async (req, res) => {
  /**
    #swagger.tags = [{ "restricted" }]
    #swagger.description = "Update User Role"
    #swagger.parameters['profile'] = {
      in: 'body',
      required: true,
      schema: {
        userID: "6",
        roleAssigned: "superadmin"
      }
    }
    #swagger.responses['200'] = { description: "API call is successful" }
    #swagger.responses['500'] = { description: "Server Error" }
  */
  try {
    const updateUserRole = await restrictedCtrl.updateUserRole(req, res)
    return updateUserRole
  } catch (error) {
    logger.error(`[${directory}/${fileName}/update-role] ${error}`)
    return res.status(500).send(messenger(filePath, 'internalError'))
  }
})

router.put('/deactivate-account', async (req, res) => {
  /**
    #swagger.tags = [{ "restricted" }]
    #swagger.description = "Deactivate User Account"
    #swagger.parameters['profile'] = {
      in: 'body',
      required: true,
      schema: {
        email: "rni@sains.com.my",
      }
    }
    #swagger.responses['200'] = { description: "API call is successful" }
    #swagger.responses['500'] = { description: "Server Error" }
  */
  try {
    const deactivateAccount = await restrictedCtrl.deactivateUserAccount(req, res)
    return deactivateAccount
  } catch (error) {
    logger.error(`[${directory}/${fileName}/deactivate-account] ${error}`)
    return res.status(500).send(messenger(filePath, 'internalError'))
  }
})

module.exports = router
