'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AccommodationPreferences', {
      AccommodationID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      TravelDetailsID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'TravelDetails', // Nama tabel referensi
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      PreferredAccommodationType: {
        type: Sequelize.ENUM('Luxury Resort','Boutique Hotel','Private Villa','Guest House','Eco Lodge','Glamping','Traditional Stay'),
        allowNull: false,
      },
      RoomType: {
        type: Sequelize.ENUM('Standard Room','Deluxe Room','Suite','Family Room','Pool Villa','Ocean View Room','Garden View Room','Connecting Room'),
        allowNull: false,
      },
      SpecialAccommodationRequests: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('AccommodationPreferences');
  },
};
