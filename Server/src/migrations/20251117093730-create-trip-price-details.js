"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create TripPriceDetails table
    await queryInterface.createTable("TripPriceDetails", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      TripID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Trips", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      pax: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sortOrder: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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

    // Create JoinTripPriceDetails table
    await queryInterface.createTable("JoinTripPriceDetails", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      JoinTripID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "JoinTrips", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      pax: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sortOrder: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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

    // Remove detailPrice column from Trips
    await queryInterface.removeColumn("Trips", "detailPrice");

    // Remove detailPrice column from JoinTrips
    await queryInterface.removeColumn("JoinTrips", "detailPrice");
  },

  async down(queryInterface, Sequelize) {
    // Drop tables
    await queryInterface.dropTable("JoinTripPriceDetails");
    await queryInterface.dropTable("TripPriceDetails");

    // Restore detailPrice columns
    await queryInterface.addColumn("Trips", "detailPrice", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("JoinTrips", "detailPrice", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },
};
