'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('unions', 'status');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('unions', 'status', {
      type: Sequelize.ENUM('union', 'pending'),
      allowNull: false,
      defaultValue: 'union', 
    });
  }
};
