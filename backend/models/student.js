'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    static associate(models) {
      // 🔄 Link each student to their projects
      Student.hasMany(models.Project, {
        foreignKey: 'studentId',
        as: 'projects',
        onDelete: 'CASCADE',
      });

      // 💬 Feedback relationship (if used)
      Student.hasMany(models.Feedback, {
        foreignKey: 'instructorId',
        as: 'givenFeedback',
        onDelete: 'CASCADE',
      });

      // 🧑‍🏫 Link to teacher (if available)
      Student.belongsTo(models.Teacher, {
        foreignKey: 'teacher_id',
        onDelete: 'SET NULL',
      });
    }
  }

  Student.init(
    {
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      grade: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('NOW()'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('NOW()'),
      },
    },
    {
      sequelize,
      modelName: 'Student',
      tableName: 'students',
    }
  );

  return Student;
};
