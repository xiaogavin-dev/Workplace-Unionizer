'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('polls');
    if (tableDescription.options) {
      await queryInterface.removeColumn('polls', 'options');
    }

    await queryInterface.addColumn('polls', 'yesCount', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addColumn('polls', 'noCount', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addColumn('polls', 'isDefault', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn('polls', 'workplaceId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'workplaces',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('polls', 'options', {
      type: Sequelize.ARRAY(Sequelize.STRING), 
      allowNull: true,
    });

    await queryInterface.removeColumn('polls', 'yesCount');
    await queryInterface.removeColumn('polls', 'noCount');
    await queryInterface.removeColumn('polls', 'isDefault');
    await queryInterface.removeColumn('polls', 'workplaceId');
  },
};