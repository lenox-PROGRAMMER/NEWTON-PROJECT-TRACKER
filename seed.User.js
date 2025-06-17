'use strict';
const bcrypt = require('bcrypt');
console.log('🚀 Seeder is running: inserting users...');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedAdmin = await bcrypt.hash('admin123', 10);
    const hashedStudent = await bcrypt.hash('student123', 10);
    const hashedLenox = await bcrypt.hash('lenox123', 10);

    return queryInterface.bulkInsert('students', [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedAdmin,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Student User',
        email: 'student@example.com',
        password: hashedStudent,
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Lenox Owino',
        email: 'lenoxowino2022@gmail.com',
        password: hashedLenox,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('students', {
      email: [
        'admin@example.com',
        'student@example.com',
        'lenoxowino2022@gmail.com'
      ]
    });
  }
};
