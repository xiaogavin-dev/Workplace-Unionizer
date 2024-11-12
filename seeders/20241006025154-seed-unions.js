'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const unions = [{
      id: uuidv4(),
      name: 'Tech Union',
      status: 'union',
      location: 'San Francisco, CA',
      organization: 'Amazon',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Health Workers Union',
      status: 'pending',
      location: 'New York, NY',
      organization: 'Healthfirst',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Teachers Union',
      status: 'union',
      location: 'Chicago, IL',
      organization: 'Public Schools',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    ];
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('unions', null, {});
  }
};