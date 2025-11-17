"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Trip extends Model {
    static associate(models) {
      Trip.hasMany(models.TripHighlight, {
        foreignKey: "TripID",
        as: "highlights",
        onDelete: "CASCADE",
      });
      Trip.hasMany(models.TripInclude, {
        foreignKey: "TripID",
        as: "includes",
        onDelete: "CASCADE",
      });
      Trip.hasMany(models.TripExclude, {
        foreignKey: "TripID",
        as: "excludes",
        onDelete: "CASCADE",
      });
      Trip.hasMany(models.TripFact, {
        foreignKey: "TripID",
        as: "facts",
        onDelete: "CASCADE",
      });
      Trip.hasMany(models.TripPriceDetail, {
        foreignKey: "TripID",
        as: "priceDetails",
        onDelete: "CASCADE",
      });
    }
  }

  Trip.init(
    {
      title: { type: DataTypes.STRING, allowNull: false },
      slug: { type: DataTypes.STRING, allowNull: false, unique: true },
      heroImage: { type: DataTypes.TEXT, allowNull: false },
      overview: { type: DataTypes.TEXT, allowNull: false },
      bestSeasonStart: DataTypes.STRING,
      bestSeasonEnd: DataTypes.STRING,
      idealPaxMin: DataTypes.INTEGER,
      idealPaxMax: DataTypes.INTEGER,
      pace: DataTypes.STRING,
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
      startDate: DataTypes.DATEONLY,
      endDate: DataTypes.DATEONLY,
    },
    {
      sequelize,
      modelName: "Trip",
      tableName: "Trips",
    }
  );

  return Trip;
};
