'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('workplaces', 'name');
    await queryInterface.removeColumn('workplaces', 'location');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('workplaces', 'name', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('workplaces', 'location', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
