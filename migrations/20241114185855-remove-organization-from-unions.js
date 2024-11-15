'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('unions', 'organization');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('unions', 'organization', {
      type: Sequelize.STRING,
      allowNull: false, 
    });
  }
};
