'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Feedback extends Model {
    static associate(models) {
      // 🔁 Feedback belongs to a Teacher (aka instructor)
      Feedback.belongsTo(models.Teacher, {
        foreignKey: 'instructorId',
        as: 'teacher', // 🔥 Must match all includes
        onDelete: 'SET NULL',
      });

      // 🔁 Feedback belongs to a Milestone
      Feedback.belongsTo(models.Milestone, {
        foreignKey: 'milestoneId',
        onDelete: 'CASCADE',
      });

      // 🔁 Feedback belongs to a Project
      Feedback.belongsTo(models.Project, {
        foreignKey: 'projectId',
        as: 'project',
        onDelete: 'CASCADE',
      });
    }
  }

  Feedback.init(
    {
      comments: {
        type: DataTypes.TEXT,
      },
      instructorId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'teachers',
          key: 'id',
        },
      },
      milestoneId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'milestones',
          key: 'id',
        },
      },
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'projects',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'Feedback',
      tableName: 'Feedbacks',
      timestamps: true,
    }
  );

  return Feedback;
};
