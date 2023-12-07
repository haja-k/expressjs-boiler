const cron = require('node-cron')
const nodemailer = require('nodemailer')
const appRoot = require('app-root-path')
const { process } = require(`${appRoot}/src/utils/util`)
// TODO: uncomment this and replace values when nodemailer is set
// const emailUser = <email-address>
// const emailPass = <email-password>

const transporter = nodemailer.createTransport({
  host: 'your-zimbra-smtp-server',
  port: 587,
  secure: false,
  auth: {
    user: emailUser,
    pass: emailPass
  }
})

const sendPasswordResetEmail = (to, resetLink, username) => {
  const mailOptions = {
    from: emailUser,
    to,
    subject: `Password Reset For ${username.toUpperCase()}`,
    html: `<p>Click the following link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error)
    } else {
      console.log('Password reset email sent:', info.response)
    }
  })
}

class CronJobManager {
  constructor () {
    this.job = null
  }

  startCronJob (schedule, data) {
    this.job = cron.schedule(schedule, () => {
      const username = process.usernameExtraction(data.email).data // Adjust as needed
      const recipientEmail = data.email
      const resetLink = `http://127.0.0.1/reset-password/${data.token}`
      sendPasswordResetEmail(recipientEmail, resetLink, username)
    })
  }

  stopCronJob () {
    if (this.job) {
      this.job.stop()
    }
  }
}

module.exports = CronJobManager
