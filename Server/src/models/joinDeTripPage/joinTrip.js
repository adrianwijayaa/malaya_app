"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class JoinTrip extends Model {
    static associate(models) {
      JoinTrip.hasMany(models.JoinTripHighlight, {
        foreignKey: "JoinTripID",
        as: "highlights",
        onDelete: "CASCADE",
      });
      JoinTrip.hasMany(models.JoinTripInclude, {
        foreignKey: "JoinTripID",
        as: "includes",
        onDelete: "CASCADE",
      });
      JoinTrip.hasMany(models.JoinTripExclude, {
        foreignKey: "JoinTripID",
        as: "excludes",
        onDelete: "CASCADE",
      });
      JoinTrip.hasMany(models.JoinTripPriceDetail, {
        foreignKey: "JoinTripID",
        as: "priceDetails",
        onDelete: "CASCADE",
      });
    }
  }

  JoinTrip.init(
    {
      title: { type: DataTypes.STRING, allowNull: false },
      subtitle: DataTypes.STRING,
      heroImage: { type: DataTypes.TEXT, allowNull: false },
      duration: { type: DataTypes.STRING, allowNull: false },
      location: { type: DataTypes.STRING, allowNull: false },
      groupSize: DataTypes.STRING,
      activityLevel: DataTypes.STRING,
      description: DataTypes.TEXT,
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
      startDate: DataTypes.DATEONLY,
      endDate: DataTypes.DATEONLY,
    },
    {
      sequelize,
      modelName: "JoinTrip",
      tableName: "JoinTrips",
    }
  );

  return JoinTrip;
};
