'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });

      Category.hasMany(models.Task, {
        foreignKey: 'categoryId',
        as: 'tasks'
      });
    }
  }

  Category.init({
    name: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'categories', 

  });

  return Category;
};
