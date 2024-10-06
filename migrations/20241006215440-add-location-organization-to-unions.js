'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('unions', 'location', {
      type: Sequelize.STRING,
      allowNull: true, 
    });
    await queryInterface.addColumn('unions', 'organization', {
      type: Sequelize.STRING,
      allowNull: true, 
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('unions', 'location');
    await queryInterface.removeColumn('unions', 'organization');
  }
};
