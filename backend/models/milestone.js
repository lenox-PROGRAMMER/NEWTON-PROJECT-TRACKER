'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Milestone extends Model {
    static associate(models) {
      
      Milestone.belongsTo(models.Project, {
        foreignKey: 'projectId',
        onDelete: 'CASCADE',
      });
    }
  }

  Milestone.init({
    title: DataTypes.STRING,
    dueDate: DataTypes.DATE,
    isComplete: DataTypes.BOOLEAN,
    projectId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Milestone',
  });

  return Milestone;
};
