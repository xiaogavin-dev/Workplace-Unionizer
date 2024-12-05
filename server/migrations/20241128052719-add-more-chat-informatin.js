'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Adding 'isDefault' column to 'chats' table
    await queryInterface.addColumn('chats', 'isDefault', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Provide a default value to avoid issues with existing data
    });

    // Adding 'isPublic' column to 'chats' table
    await queryInterface.addColumn('chats', 'isPublic', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Provide a default value to avoid issues with existing data
    });

    // Adding 'role' column to 'user_chats' table
    await queryInterface.addColumn('user_chats', 'role', {
      type: Sequelize.ENUM('general', 'admin'),
      allowNull: false,
    });


  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('chats', 'isDefault');

    await queryInterface.removeColumn('chats', 'isPublic');

    await queryInterface.removeColumn('user_chats', 'role');

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_user_chats_role";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_user_workplaces_role";'
    );
  },
};