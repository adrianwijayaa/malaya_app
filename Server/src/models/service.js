"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    static associate(_models) {
      // Define associations here if needed
    }
  }

  Service.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rating: {
        type: DataTypes.DECIMAL(2, 1),
        allowNull: false,
        defaultValue: 4.5,
      },
      reviews: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      detailDescription: {
        type: DataTypes.TEXT("long"),
        allowNull: true,
      },
      packages: {
        type: DataTypes.JSON,
        allowNull: true,
        get() {
          const raw = this.getDataValue("packages");
          return raw ? JSON.parse(JSON.stringify(raw)) : [];
        },
      },
      valueProps: {
        type: DataTypes.JSON,
        allowNull: true,
        get() {
          const raw = this.getDataValue("valueProps");
          return raw ? JSON.parse(JSON.stringify(raw)) : [];
        },
      },
      testimonials: {
        type: DataTypes.JSON,
        allowNull: true,
        get() {
          const raw = this.getDataValue("testimonials");
          return raw ? JSON.parse(JSON.stringify(raw)) : [];
        },
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Service",
    }
  );

  return Service;
};

