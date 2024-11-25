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
    await queryInterface.addColumn('unions', 'visibility', {
      type: Sequelize.ENUM('public', 'private'),
      allowNull: true,
    });
    await queryInterface.addColumn('unions', 'description', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('unions');
    if (tableInfo.description) {
      await queryInterface.removeColumn('unions', 'description');
    } else {
      console.warn("Column 'description' does not exist, skipping removal.");
    }
    if (tableInfo.visibility) {
      await queryInterface.removeColumn('unions', 'visibility');
    } else {
      console.warn("Column 'visibility' does not exist, skipping removal.");
    }
    await queryInterface.removeColumn('unions', 'workplaces');
    await queryInterface.removeColumn('unions', 'image');
  }
};
