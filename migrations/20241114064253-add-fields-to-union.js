'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('unions', 'workplaces', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: [], 
    });
    await queryInterface.addColumn('unions', 'image', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('unions', 'description');
    await queryInterface.removeColumn('unions', 'visibility');
    await queryInterface.removeColumn('unions', 'workplaces');
    await queryInterface.removeColumn('unions', 'image');
  }
};
