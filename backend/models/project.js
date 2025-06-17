'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      // 🔁 Belongs to a student
      Project.belongsTo(models.Student, {
        foreignKey: 'studentId',
        as: 'student',
        onDelete: 'CASCADE',
      });

      // 💬 Has optional feedback from instructor
      Project.hasOne(models.Feedback, {
        foreignKey: 'projectId',
        as: 'feedback',
        onDelete: 'CASCADE',
      });
    }
  }

  Project.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      githubLink: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: true,
        },
      },
      status: {
        type: DataTypes.ENUM('submitted', 'reviewed', 'approved', 'rejected'),
        defaultValue: 'submitted',
        allowNull: false,
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Project',
      tableName: 'projects',
      timestamps: true,
    }
  );

  return Project;
};
