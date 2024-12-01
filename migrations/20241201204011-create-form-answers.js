'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('form_answers', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'users',
          key: 'uid',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      unionId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'unions',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      questionId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'form_questions',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      answerText: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('form_answers');
  },
};
