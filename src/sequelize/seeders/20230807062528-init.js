'use strict'
/* eslint-disable */
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      { name: 'superadmin' },
      { name: 'admin' },
      { name: 'user' }
    ]),
    await queryInterface.bulkInsert('users', [
      { username: 'davidwallace', password: '$2b$12$HoH8vI5x7PRK/juf4mI2NuHh43e8XsOxqGiW9m0Jf2K.MBaUKX77q', email: 'davidwallace@sains.com.my', full_name: 'David Wallace', role_id: 1, is_active: 1, login_type: 'direct', last_login: '2023-09-07 14:33:43', created_at: '2023-08-23 16:07:34' },
      { username: 'michaelscott', password: '$2b$12$XJdJ.eoPjkBITzlK6VTqVe990/SRoCKoykcfH5IsvMGK7WeImE0.C', email: 'michaelscott@sains.com.my', full_name: 'Michael Scott', role_id: 2, is_active: 1, login_type: 'direct', last_login: '2023-08-23 16:07:57', created_at: '2023-08-23 16:19:43' },
      { username: 'jimhalpert', password: '$2b$12$tTrJ9EnTyf9zLe64vyASa.l21lExrlF7rM.8loiRF7aijud/hkon.', email: 'jimhalpert@sains.com.my', full_name: 'James Duncan Halpert', role_id: 2, is_active: 1, login_type: 'direct', last_login: '2023-09-07 14:43:30', created_at: '2023-08-23 16:07:34' },
      { username: 'andybernard', password: '$2b$12$MfFtiEjhjubmcqIxPBqkZuzgRcGbMcTHNKlQfenaoxNErAH.ScPFe', email: 'andybernard@sains.com.my', full_name: 'Andrew Baines Bernard', role_id: 2, is_active: 1, login_type: 'direct', last_login: '2023-09-07 14:33:43', created_at: '2023-08-23 16:07:34' },
      { username: 'dwightschrute', password: '$2b$12$kIJ1LnmQP52y79fPf0JKi..fP4qtNNr4R6wmg0ONl03sTAzWgPR62', email: 'dwightschrute@sains.com.my', full_name: 'Dwight Kurt Schrute III', role_id: 3, is_active: 1, login_type: 'direct', last_login: '2023-09-07 14:33:43', created_at: '2023-08-23 16:07:34' },
      { username: 'pambeesly', password: '$2b$12$rMJaqbvau7ugPrUjI1AyCOeGi5RVcPjzVlr.NeBLbv2JeMi.2Rpme', email: 'pambeesly@sains.com.my', full_name: 'Pamela Morgan Halpert', role_id: 3, is_active: 1, login_type: 'direct', last_login: '2023-09-07 12:11:22', created_at: '2023-08-23 16:07:34' }
    ]),
    await queryInterface.bulkInsert('notification_types', [
      { name: 'reminder' }, // accounts
      { name: 'announcement' }, // administrative
      { name: 'updates' } // training updates, errors
    ]),
    await queryInterface.bulkInsert('notification_messages', [
      { message: 'You have been added to [project_name].' },
      { message: 'Your password have been updated recently.' },
      { message: 'Your role has been updated to [role_name]' },
      { message: 'A new team member, [username], has joined [project_name]' },
      { message: 'A team member, [username], has been removed from [project_name]' }
    ]),
    await queryInterface.bulkInsert('error_codes', [
      { code: '011001', module: 'authentication', description: 'Required Field Missing', severity: 'LOW' },
      { code: '011102', module: 'authentication', description: 'LDAP Invalid Credentials', severity: 'LOW' },
      { code: '011203', module: 'authentication', description: 'User Not Found', severity: 'WARNING' },
      { code: '011204', module: 'authentication', description: 'User Data Not Found', severity: 'WARNING' },
      { code: '011205', module: 'authentication', description: 'Password Mismatch', severity: 'WARNING' },
      { code: '011206', module: 'authentication', description: 'Password Not Updated', severity: 'MEDIUM' },
      { code: '011007', module: 'authentication', description: 'Internal Server Error', severity: 'HIGH' },
      { code: '021001', module: 'logout', description: 'Session Cannot Be Destroyed', severity: 'HIGH' },
      { code: '021002', module: 'logout', description: 'Internal Server Error', severity: 'HIGH' },
      { code: '031001', module: 'registration', description: 'Unauthorized Access', severity: 'WARNING' },
      { code: '032002', module: 'registration', description: 'Required Field Missing', severity: 'LOW' },
      { code: '032003', module: 'registration', description: 'Record Already Created', severity: 'WARNING' },
      { code: '032004', module: 'registration', description: 'Internal Server Error', severity: 'HIGH' },
      { code: '041001', module: 'change password', description: 'Unauthorized Access', severity: 'WARNING' },
      { code: '042002', module: 'change password', description: 'Required Field Missing', severity: 'LOW' },
      { code: '042003', module: 'change password', description: 'User Data Not Found', severity: 'LOW' },
      { code: '042104', module: 'change password', description: 'Old Password Given Mismatch', severity: 'WARNING' },
      { code: '042105', module: 'change password', description: 'Old & New Password Match', severity: 'WARNING' },
      { code: '042206', module: 'change password', description: 'Password Services Error', severity: 'MEDIUM' },
      { code: '042007', module: 'change password', description: 'Internal Server Error', severity: 'HIGH' },
      { code: '051001', module: 'role update', description: 'Unauthorized Access', severity: 'WARNING' },
      { code: '052002', module: 'role update', description: 'Required Field Missing', severity: 'LOW' },
      { code: '052103', module: 'role update', description: 'Same As Previous Role', severity: 'WARNING' },
      { code: '052104', module: 'role update', description: 'Role Not Found', severity: 'LOW' },
      { code: '052005', module: 'role update', description: 'Internal Server Error', severity: 'HIGH' }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {})
    await queryInterface.bulkDelete('users', null, {})
    await queryInterface.bulkDelete('notification_types', null, {})
    await queryInterface.bulkDelete('notification_messages', null, {})
  }
}
