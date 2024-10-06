'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('unions', [{
        name: 'Tech Union',
        status: 'union',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Health Workers Union',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Teachers Union',
        status: 'union',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('unions', null, {});
  }
};