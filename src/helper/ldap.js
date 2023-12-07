const LdapAuth = require('ldapauth-fork')
const appRoot = require('app-root-path')
const logger = require(`${appRoot}/src/plugins/logger`)
const directory = __dirname.split(require('path').sep).pop()

// TODO: uncomment this when have own parameter
// const ldapConfig = {
//   url: // get info from company,
//   bindDN: // get info from company,
//   bindCredentials:  // process.env.PASSWORD;
//   searchBase: // get info from company,
//   searchFilter: // get info from company,
//   reconnect: true
// }

let ldap

module.exports = {
  init: () => {
    ldap = new LdapAuth(ldapConfig)
    ldap.on('error', (err) => {
      logger.error('LdapAuth: ' + err)
    })
  },

  authenticate: async (username, password) => {
    try {
      const user = await new Promise((resolve, reject) => {
        ldap.authenticate(username, password, (err, user) => {
          if (err) reject(err)
          logger.http(`Authenticate ${user}`)
          resolve(user)
        })
      })
      return module.exports._promiseTimeout(5000, user, 'Cannot authenticate with LDAP')
    } catch (error) {
      logger.error(`[${directory}] ${error}`)
      return {
        error: true,
        message: `${error}`
      }
    }
  },

  close: () => {
    ldap.close((err) => {
      if (err) logger.error('On close: ' + err)
    })
  },

  _promiseTimeout: (ms, promise, errorString) => {
    return Promise.race([
      promise,
      new Promise((_resolve, reject) => {
        setTimeout(() => {
          reject(errorString)
        }, ms)
      })
    ])
  }
}
