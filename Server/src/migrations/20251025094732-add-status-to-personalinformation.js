"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Cek apakah kolom sudah ada
    const tableDescription = await queryInterface.describeTable(
      "PersonalInformations"
    );

    if (!tableDescription.status) {
      await queryInterface.addColumn("PersonalInformations", "status", {
        type: Sequelize.ENUM("pending", "confirmed", "cancelled"),
        defaultValue: "pending",
        allowNull: false,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("PersonalInformations", "status");
  },
};
