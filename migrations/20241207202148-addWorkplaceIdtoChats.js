'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('chats', 'workplaceId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'workplaces',
        key: 'id'
      },
      onUpdate: 'CASCADE', // Optional: Handles updates to referenced keys
      onDelete: 'SET NULL',
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('chats', 'workplaceId')
  }
};
