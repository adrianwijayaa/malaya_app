"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class News extends Model {
    static associate(_models) {}
  }

  News.init(
    {
      title: { type: DataTypes.STRING, allowNull: false },
      desc: { type: DataTypes.TEXT, allowNull: false },
      imageUrl: { type: DataTypes.STRING, allowNull: true },
      slug: { type: DataTypes.STRING, allowNull: false, unique: true },
      // simpan sebagai string "YYYY-MM-DD" agar konsisten dengan referensi lain
      date: { type: DataTypes.STRING, allowNull: false },
      readTime: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 3 },
      featured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      body: { type: DataTypes.TEXT("long"), allowNull: true },
      // 🔹 NEW: status aktif/arsip
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    { sequelize, modelName: "News" }
  );

  return News;
};
