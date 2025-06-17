'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    static associate(models) {
      // A Teacher can give many feedbacks
      Teacher.hasMany(models.Feedback, {
        foreignKey: 'instructorId',
        as: 'feedbacks', // Used if you want to include teacher's feedback history
        onDelete: 'SET NULL',
      });
    }
  }

  Teacher.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [2, 100],
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
    },
    {
      sequelize,
      modelName: 'Teacher',
      tableName: 'teachers',
      timestamps: true,
    }
  );

  return Teacher;
};
