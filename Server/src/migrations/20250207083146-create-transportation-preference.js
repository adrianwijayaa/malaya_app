"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("TransportationPreferences", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      TravelDetailsID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "TravelDetails",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      InternationalFlightRequired: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      DepartureCity: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      DomesticFlightRequired: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      DomesticDepartureCity: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      PreferredTransportType: {
        type: Sequelize.ENUM(
          "Private Car with Driver",
          "Shared Van/Bus Service",
          "Self-Drive Rental Car",
          "Motorcycle Rental",
          "Boat/Ferry Service",
          "Luxury Vehicle Service",
          "Mixed Transportation"
        ),
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
    await queryInterface.dropTable("TransportationPreferences");
  },
};
