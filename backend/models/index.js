'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.cjs')[env];

const db = {};
let sequelize;

// 🌐 Initialize Sequelize
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// 📦 Dynamically load all models in this folder
fs.readdirSync(__dirname)
  .filter(file =>
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.endsWith('.js') &&
    !file.endsWith('.test.js')
  )
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// 🔗 Wire up model associations
Object.values(db).forEach(model => {
  if (typeof model.associate === 'function') {
    model.associate(db);
  }
});

// 🔍 Confirm associations on Feedback
console.log('📦 Feedback Associations:', Object.keys(db.Feedback.associations)); // Should include 'teacher'

// ✅ Export everything
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
