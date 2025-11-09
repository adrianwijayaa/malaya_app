"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("JoinTrips", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: { type: Sequelize.STRING, allowNull: false },
      subtitle: { type: Sequelize.STRING },
      heroImage: { type: Sequelize.STRING, allowNull: false },
      date: { type: Sequelize.STRING, allowNull: false },
      duration: { type: Sequelize.STRING, allowNull: false },
      location: { type: Sequelize.STRING, allowNull: false },
      groupSize: { type: Sequelize.STRING },
      activityLevel: { type: Sequelize.STRING },
      description: { type: Sequelize.TEXT, allowNull: false },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("JoinTrips");
  },
};
