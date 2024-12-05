'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('unions', 'organization');
  },

  down: async (queryInterface, Sequelize) => {
    // Add the column back but initially allow null values
    await queryInterface.addColumn('unions', 'organization', {
      type: Sequelize.STRING,
      allowNull: true, // Temporarily allow nulls
    });

    // Optional: Fill the column with a default value (if needed)
    await queryInterface.sequelize.query(
      `UPDATE unions SET organization = 'Default Organization' WHERE organization IS NULL`
    );

    // Add NOT NULL constraint (if it was originally not null)
    await queryInterface.changeColumn('unions', 'organization', {
      type: Sequelize.STRING,
      allowNull: false, // Now enforce NOT NULL
    });
  },
};
