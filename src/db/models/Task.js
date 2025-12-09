'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      Task.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });

      Task.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        as: 'category'
      });
    }
  }

  Task.init({
    title: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM("pending", "completed"),
      defaultValue: "pending"
    },
    userId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Task',
  });

  return Task;
};
