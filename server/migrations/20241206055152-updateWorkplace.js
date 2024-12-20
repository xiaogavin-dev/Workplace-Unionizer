'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('workplaces', 'isUnionized', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn('workplaces', 'employeeCount', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
    });

    await queryInterface.addColumn('workplaces', 'isPublic', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down (queryInterface, Sequelize) { 
    await queryInterface.removeColumn('workplaces', 'isUnionized');
    await queryInterface.removeColumn('workplaces', 'employeeCount');
    await queryInterface.removeColumn('workplaces', 'isPublic');
  }
};
