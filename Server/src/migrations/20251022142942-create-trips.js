"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Trips", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: { type: Sequelize.STRING, allowNull: false },
      slug: { type: Sequelize.STRING, allowNull: false, unique: true },
      heroImage: { type: Sequelize.STRING, allowNull: false },
      overview: { type: Sequelize.TEXT, allowNull: false },
      bestSeasonStart: { type: Sequelize.STRING },
      bestSeasonEnd: { type: Sequelize.STRING },
      idealPaxMin: { type: Sequelize.INTEGER },
      idealPaxMax: { type: Sequelize.INTEGER },
      pace: { type: Sequelize.ENUM("Relaxed", "Balanced", "Active") },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("Trips");
  },
};
