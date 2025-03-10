"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("TravelDetails", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      PersonalID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "PersonalInformations",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      PreferredDestinations: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      PreferredStartDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      FlexibleDates: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      TripDurationDays: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Adults: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Children: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ChildrenAges: {
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
    await queryInterface.dropTable("TravelDetails");
  },
};
