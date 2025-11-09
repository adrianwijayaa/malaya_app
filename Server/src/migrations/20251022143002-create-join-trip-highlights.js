"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("JoinTripHighlights", {
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
      imageUrl: { type: Sequelize.STRING, allowNull: false },
      text: { type: Sequelize.STRING, allowNull: false },
      sortOrder: { type: Sequelize.INTEGER, defaultValue: 0 },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("JoinTripHighlights");
  },
};
