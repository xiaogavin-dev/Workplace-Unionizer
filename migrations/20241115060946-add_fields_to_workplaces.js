'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('workplaces', 'workplaceName', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn('workplaces', 'organization', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn('workplaces', 'city', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn('workplaces', 'street', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('workplaces', 'addressLine2', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('workplaces', 'state', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn('workplaces', 'zip', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('workplaces', 'country', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('workplaces', 'workplaceName');
    await queryInterface.removeColumn('workplaces', 'organization');
    await queryInterface.removeColumn('workplaces', 'city');
    await queryInterface.removeColumn('workplaces', 'street');
    await queryInterface.removeColumn('workplaces', 'addressLine2');
    await queryInterface.removeColumn('workplaces', 'state');
    await queryInterface.removeColumn('workplaces', 'zip');
    await queryInterface.removeColumn('workplaces', 'country');
  }
};

