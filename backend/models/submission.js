'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Submission extends Model {
    static associate(models) {
      Submission.belongsTo(models.Project, {
        foreignKey: 'projectId',
        onDelete: 'CASCADE',
      });
    }
  }

  Submission.init({
    fileUrl: DataTypes.STRING,
    submittedAt: DataTypes.DATE,
    approved: DataTypes.BOOLEAN,
    projectId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Submission',
  });

  return Submission;
};
