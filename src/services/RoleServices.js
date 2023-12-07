const appRoot = require('app-root-path')
const { path, logger, database } = require(`${appRoot}/src/utils/util`)
const fileName = __filename.split(path.sep).pop()
const directory = __dirname.split(path.sep).pop()

module.exports = {
  updateUserRole: async (email, roleAssigned) => {
    try {
      const role = await database.Role.findOne({
        attributes: ['id'],
        where: {
          name: roleAssigned
        }
      })

      if (!role) {
        throw new Error(`Role with name "${roleAssigned}" not found.`)
      }
      const userData = await database.User.update({
        role_id: role.id
      },
      {
        where: {
          email
        }
      })
      return userData
    } catch (error) {
      logger.error(`[${directory}/${fileName}/updateUserRole] Error updating user role: ${email} - ` + error)
      throw error
    }
  },
  sameRoleCheck: async (email, roleAssigned) => {
    try {
      const role = await database.Role.findOne({
        attributes: ['id'],
        where: {
          name: roleAssigned
        }
      })
      if (!role) {
        throw new Error(`Role Not Found: ${roleAssigned}`)
      }
      const userData = await database.User.findOne({ where: { email }, attributes: ['role_id'] })
      if (!userData) {
        throw new Error(`User Not Found: ${email}`)
      }
      if (userData.role_id === role.id) {
        return true
      } else {
        return false
      }
    } catch (error) {
      logger.error(`[${directory}/${fileName}/sameRoleCheck] Error checking user role: ${email} - ` + error)
      throw error
    }
  }
}
