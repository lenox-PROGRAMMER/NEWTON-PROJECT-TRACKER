'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('projects', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      title: Sequelize.STRING,
      description: Sequelize.TEXT,
      githubLink: Sequelize.STRING,
      status: { type: Sequelize.STRING, defaultValue: 'submitted' },
      studentId: Sequelize.INTEGER,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('projects');
  },
};
