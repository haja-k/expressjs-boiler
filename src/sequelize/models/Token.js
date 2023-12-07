'use strict'

module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define(
    'Token',
    {
      token: DataTypes.STRING,
      email: DataTypes.STRING,
      created_at: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'token',
      createdAt: 'created_at',
      updatedAt: false
    }
  )
  return Token
}
