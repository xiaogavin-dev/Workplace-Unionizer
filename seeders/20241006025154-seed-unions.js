'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('unions', [{
        name: 'Tech Union',
        status: 'union',
        location: 'San Francisco, CA',
        organization: 'Amazon',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Health Workers Union',
        status: 'pending',
        location: 'New York, NY',
        organization: 'Healthfirst',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Teachers Union',
        status: 'union',
        location: 'Chicago, IL',
        organization: 'Public Schools',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('unions', null, {});
  }
};