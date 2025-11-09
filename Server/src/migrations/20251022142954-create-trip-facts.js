"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("TripFacts", {
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
      key: {
        type: Sequelize.ENUM("Accommodation", "Experience", "Safety"),
        allowNull: false,
      },
      value: { type: Sequelize.STRING, allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("TripFacts");
  },
};
