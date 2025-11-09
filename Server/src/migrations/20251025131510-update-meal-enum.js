"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Ubah nama enum lama (rename agar bisa buat baru)
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_MealPreferences_MealPlanPreferences"
      RENAME TO "enum_MealPreferences_MealPlanPreferences_old";
    `);

    // 2. Buat enum baru dengan huruf "I" besar
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_MealPreferences_MealPlanPreferences" AS ENUM (
        'All-Inclusive (All Meals)',
        'Breakfast Only',
        'Half Board (Breakfast & Dinner)',
        'Full Board (All Meals)',
        'Pay As You Go',
        'Custom Plan'
      );
    `);

    // 3. Ubah kolom di tabel pakai enum baru
    await queryInterface.sequelize.query(`
      ALTER TABLE "MealPreferences"
      ALTER COLUMN "MealPlanPreferences"
      TYPE "enum_MealPreferences_MealPlanPreferences"
      USING "MealPlanPreferences"::text::"enum_MealPreferences_MealPlanPreferences";
    `);

    // 4. Hapus enum lama
    await queryInterface.sequelize.query(`
      DROP TYPE "enum_MealPreferences_MealPlanPreferences_old";
    `);
  },

  async down(queryInterface, Sequelize) {
    // Balikin enum lama kalau rollback
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_MealPreferences_MealPlanPreferences_old" AS ENUM (
        'All-inclusive (All Meals)',
        'Breakfast Only',
        'Half Board (Breakfast & Dinner)',
        'Full Board (All Meals)',
        'Pay As You Go',
        'Custom Plan'
      );
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "MealPreferences"
      ALTER COLUMN "MealPlanPreferences"
      TYPE "enum_MealPreferences_MealPlanPreferences_old"
      USING "MealPlanPreferences"::text::"enum_MealPreferences_MealPlanPreferences_old";
    `);

    await queryInterface.sequelize.query(`
      DROP TYPE "enum_MealPreferences_MealPlanPreferences";
    `);

    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_MealPreferences_MealPlanPreferences_old"
      RENAME TO "enum_MealPreferences_MealPlanPreferences";
    `);
  },
};
