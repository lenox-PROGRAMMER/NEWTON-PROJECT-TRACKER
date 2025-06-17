'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    static associate(models) {
      // Teacher oversees students
      Teacher.hasMany(models.Student, {
        foreignKey: 'teacher_id',
        onDelete: 'SET NULL',
      });

      // Teacher gives feedback
      Teacher.hasMany(models.Feedback, {
        foreignKey: 'instructorId',
        as: 'feedbacks', 
        onDelete: 'SET NULL',
      });
    }
  }

  Teacher.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      department: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Teacher',
      tableName: 'teachers',
    }
  );

  return Teacher;
};
