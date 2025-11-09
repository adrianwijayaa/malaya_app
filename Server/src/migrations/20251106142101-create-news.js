"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("News", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: { type: Sequelize.STRING, allowNull: false },
      desc: { type: Sequelize.TEXT, allowNull: false },
      imageUrl: { type: Sequelize.STRING },
      slug: { type: Sequelize.STRING, allowNull: false, unique: true },
      date: { type: Sequelize.STRING, allowNull: false }, // "YYYY-MM-DD"
      readTime: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 3 },
      featured: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      body: { type: Sequelize.TEXT("long") },
      // 🔹 NEW
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    await queryInterface.addIndex("News", ["slug"], {
      unique: true,
      name: "news_slug_uq",
    });
    await queryInterface.addIndex("News", ["date"], { name: "news_date_idx" });
    await queryInterface.addIndex("News", ["featured", "date"], {
      name: "news_featured_date_idx",
    });
    // 🔹 NEW: bantu filter status + sort date
    await queryInterface.addIndex("News", ["isActive", "date"], {
      name: "news_isActive_date_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("News", "news_isActive_date_idx");
    await queryInterface.removeIndex("News", "news_featured_date_idx");
    await queryInterface.removeIndex("News", "news_date_idx");
    await queryInterface.removeIndex("News", "news_slug_uq");
    await queryInterface.dropTable("News");
  },
};
