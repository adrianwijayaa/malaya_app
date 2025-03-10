"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Submissions", {
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
          model: "PersonalInformations", // Sesuaikan dengan tabel referensi
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      HowDidYouHear: {
        type: Sequelize.ENUM(
          "GOOGLE_SEARCH",
          "SOCIAL_MEDIA",
          "FRIEND_FAMILY",
          "TRAVEL_BLOG",
          "PREVIOUS_CUSTOMER",
          "TRAVEL_AGENT",
          "ADVERTISEMENT",
          "OTHER"
        ),
        allowNull: false,
      },
      Consent: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable("Submissions");
  },
};
