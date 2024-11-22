'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('unions', 'location');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('unions', 'location', {
      type: Sequelize.STRING,
      allowNull: false, 
    });
  }
};
