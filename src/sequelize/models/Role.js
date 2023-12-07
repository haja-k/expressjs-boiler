'use strict'

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    'Role',
    {
      name: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'role',
      createdAt: false,
      updatedAt: false
    }
  )
  Role.associate = (models) => {
    Role.hasMany(models.User, {
      foreignKey: 'role_id' // Foreign key in the "User" model referencing the "Role" model
    })
  }
  return Role
}
