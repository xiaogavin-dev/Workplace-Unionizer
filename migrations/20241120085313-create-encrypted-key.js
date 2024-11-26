'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('encryptedKeys', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      encryptedKey: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      versionId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "keyVersions",
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      pubkeyValue: {
        type: Sequelize.TEXT,
        allowNull: false,
        references: {
          model: "pubkeys",
          key: 'value'
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      chatId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'chats',
          key: 'id'
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('encryptedKeys');
  }
};