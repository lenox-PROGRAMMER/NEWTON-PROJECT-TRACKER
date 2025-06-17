'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Feedback extends Model {
    static associate(models) {
      // Associations
      Feedback.belongsTo(models.Project, {
        foreignKey: 'projectId',
        as: 'project',
        onDelete: 'CASCADE',
      });

      Feedback.belongsTo(models.Student, {
        foreignKey: 'studentId',
        as: 'student',
        onDelete: 'SET NULL',
      });

      Feedback.belongsTo(models.Teacher, {
        foreignKey: 'instructorId',
        as: 'teacher', 
        onDelete: 'SET NULL',
      });
    }
  }

  Feedback.init(
    {
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'projects',
          key: 'id',
        },
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      instructorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'teachers',
          key: 'id',
        },
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'students',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Feedback',
      tableName: 'feedbacks',
      timestamps: true,
    }
  );

  return Feedback;
};
