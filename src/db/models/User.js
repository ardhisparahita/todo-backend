'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Associations
     */
    static associate(models) {
      User.hasMany(models.Category, {
        foreignKey: 'userId',
        as: 'categories'
      });

      User.hasMany(models.Task, {
        foreignKey: 'userId',
        as: 'tasks'
      });
    }
  }

  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    provider: {
      type: DataTypes.STRING,
      defaultValue: "local",
    },

  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users', 
  });

  return User;
};
