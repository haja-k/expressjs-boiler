const appRoot = require('app-root-path')
const logger = require(`${appRoot}/src/plugins/logger`)
const database = require(`${appRoot}/src/sequelize/models`)
const path = require('path')
const fileName = __filename.split(path.sep).pop()
const directory = __dirname.split(path.sep).pop()

module.exports = {
  getUserList: async () => {
    try {
      const users = await database.User.findAll({
        attributes: ['id', 'username', 'email', 'full_name', 'is_active'],
        include: [
          {
            model: database.Group,
            as: 'groups',
            attributes: ['name']
          }
        ]
      })
      if (users.length === 0) {
        logger.error(`[${directory}/${fileName}/getUserList] Users table is empty`)
        return { success: false, message: 'empty' }
      } else {
        const userData = await Promise.all(users.map(async (entry) => {
          const groupNames = entry.groups.map((group) => group.name)

          return {
            id: entry.id,
            username: entry.username,
            email: entry.email,
            full_name: entry.full_name,
            is_active: entry.is_active,
            groups: groupNames
          }
        }))
        logger.info(`[${directory}/${fileName}/getUserList] User list retrieved successfully`)
        return {
          success: true,
          data: userData
        }
      }
    } catch (error) {
      logger.error(`[${directory}/${fileName}/getUserList] Error getting user list: ` + error)
      return { success: false, message: 'error' }
    }
  },
  getUser: async (username) => {
    try {
      const userData = await database.User.findOne({
        where: { username }, attributes: ['id', 'username', 'email', 'password', 'full_name', 'role_id', 'is_active']
      })
      return userData
    } catch (error) {
      logger.error(`[${directory}/${fileName}/getUser] Error finding user: ${username} - ` + error)
      throw error
    }
  },
  getUserProfile: async (username) => {
    try {
      const userData = await database.User.findOne({
        where: { username },
        attributes: ['id', 'username', 'email', 'full_name', 'role_id', 'is_active'],
        include: [
          {
            model: database.Group,
            as: 'groups',
            attributes: ['id', 'name', 'description'],
            through: {
              model: database.Group_Member,
              attributes: []
            }
          },
          {
            model: database.Project,
            attributes: ['id', 'name', 'description'],
            through: {
              model: database.Project_Member,
              attributes: []
            }
          }
        ]
      })
      const groups = userData.groups.map((group) => ({
        id: group.id,
        name: group.name
      }))
      const projects = userData.Projects.map((project) => ({
        id: project.id,
        name: project.name
      }))

      const userProfile = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        roleID: userData.role_id,
        fullName: userData.full_name,
        isActive: userData.is_active,
        groups,
        projects
      }
      return userProfile
    } catch (error) {
      logger.error(`[${directory}/${fileName}/getUserProfile] Error retrieving user profile: ${username} - ` + error)
      throw error
    }
  },
  getAccValidity: async (username) => {
    try {
      const userData = await database.User.findOne({
        where: { username }, attributes: ['is_active']
      })
      if (userData.is_active === true) {
        return true
      } else {
        return false
      }
    } catch (error) {
      logger.error(`[${directory}/${fileName}/getUser] Error getting user validity: ${username} - ` + error)
      return null
    }
  },
  getUserDataByID: async (userID) => {
    try {
      const userData = await database.User.findOne({
        where: { id: userID }, attributes: ['id', 'username', 'email', 'password', 'full_name', 'role_id', 'is_active']
      })
      return userData
    } catch (error) {
      logger.error(`[${directory}/${fileName}/getUser] Error finding user: ${userID} - ` + error)
      throw error
    }
  },
  findByID: async (id) => {
    try {
      const userData = await database.User.findOne({ where: { id }, attributes: ['password'] })
      return {
        error: false,
        data: userData.password
      }
    } catch (error) {
      logger.error(`[${directory}/${fileName}/findByID] Error finding user by ID: ${id} - ` + error)
      return {
        error: true
      }
    }
  },
  addUser: async (username, email, fullName, loginType) => {
    try {
      const userData = await database.User.create({
        username,
        email,
        full_name: fullName,
        login_type: loginType
      })
      return userData
    } catch (error) {
      logger.error(`[${directory}/${fileName}/addUser] Error adding user: ${username} - ` + error)
      throw error
    }
  },
  deactivateUser: async (email) => {
    try {
      const userData = await database.User.update({
        is_active: false
      },
      {
        where: {
          email
        }
      })
      return userData
    } catch (error) {
      logger.error(`[${directory}/${fileName}/deactivateUser] Error updating user: ${email} - ` + error)
      throw error
    }
  },
  changePassword: async (id, password) => {
    try {
      await database.User.update({ password }, { where: { id } })
      return {
        error: false
      }
    } catch (error) {
      logger.error(`[${directory}/${fileName}/changePassword] Error updating user password: ${id} - ` + error)
      return {
        error: true
      }
    }
  },
  resetPassword: async (email, password) => {
    try {
      await database.User.update({ password }, { where: { email } })
      return {
        success: true
      }
    } catch (error) {
      logger.error(`[${directory}/${fileName}/resetPassword] Error updating user password: ${email} - ` + error)
      return {
        success: false
      }
    }
  },
  updateLoginTimestamp: async (timestamp, username) => {
    try {
      await database.User.update({ last_login: timestamp }, { where: { username } })
      return {
        error: false
      }
    } catch (error) {
      logger.error(`[${directory}/${fileName}/updateLoginTimestamp] Error updating user login timestamp: ${username} - ` + error)
      return {
        error: true
      }
    }
  },
  updateToken: async (token, email) => {
    try {
      const tokenData = await database.Token.create({
        token,
        email
      })
      return tokenData
    } catch (error) {
      logger.error(`[${directory}/${fileName}/updateToken] Error adding token: ${email} - ` + error)
      throw error
    }
  },
  compareToken: async (token) => {
    try {
      const userData = await database.Token.findOne({ where: { token }, attributes: ['email'] })
      return {
        success: true,
        data: userData.email
      }
    } catch (error) {
      logger.error(`[${directory}/${fileName}/compareToken] Error finding token: ${token} - ` + error)
      return {
        success: false
      }
    }
  },
  deleteToken: async (token, email) => {
    try {
      const transaction = await database.sequelize.transaction()
      const tokenFind = await database.Token.findOne({ where: { token } })
      if (!tokenFind) {
        await transaction.rollback()
        logger.error(`[${directory}/${fileName}/deleteToken] Token ${token} not found.`)
        return false
      }
      await database.Token.destroy({ where: { token, email }, transaction })
      await transaction.commit()
      return true
    } catch (error) {
      /* eslint-disable */
      await transaction.rollback()
      /* eslint-enable */
      logger.error(`[${directory}/${fileName}/deleteToken] Failed to delete token ${token} ${error}`)
      return false
    }
  }
}
