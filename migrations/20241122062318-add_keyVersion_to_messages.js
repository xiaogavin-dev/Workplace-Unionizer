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
    return queryInterface.addColumn(
      'message',
      'keyVersionId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'keyVersion',
        key: 'id'
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    }

    )
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.removeColumn(
      'message',
      'keyVersionId'
    );
  }
};
