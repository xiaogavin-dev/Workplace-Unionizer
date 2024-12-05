'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('unions', 'location');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('unions', 'location', {
      type: Sequelize.STRING,
      allowNull: true, // Temporarily allow nulls
    });

    // Optional: Fill the column with a default value for existing rows
    await queryInterface.sequelize.query(
      `UPDATE unions SET location = 'Default Location' WHERE location IS NULL`
    );

    // Add NOT NULL constraint (if it was originally not null)
    await queryInterface.changeColumn('unions', 'location', {
      type: Sequelize.STRING,
      allowNull: false, // Enforce NOT NULL after filling defaults
    });
  }
};
