"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Trip extends Model {
    static associate(models) {
      Trip.hasMany(models.TripHighlight, {
        foreignKey: "TripID",
        as: "highlights",
      });
      Trip.hasMany(models.TripInclude, {
        foreignKey: "TripID",
        as: "includes",
      });
      Trip.hasMany(models.TripFact, { foreignKey: "TripID", as: "facts" });
    }
  }

  Trip.init(
    {
      title: { type: DataTypes.STRING, allowNull: false },
      slug: { type: DataTypes.STRING, allowNull: false, unique: true },
      heroImage: { type: DataTypes.STRING, allowNull: false },
      overview: { type: DataTypes.TEXT, allowNull: false },
      bestSeasonStart: { type: DataTypes.STRING, allowNull: true },
      bestSeasonEnd: { type: DataTypes.STRING, allowNull: true },
      idealPaxMin: { type: DataTypes.INTEGER, allowNull: true },
      idealPaxMax: { type: DataTypes.INTEGER, allowNull: true },
      pace: {
        type: DataTypes.ENUM("Relaxed", "Balanced", "Active"),
        allowNull: true,
      },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      sequelize,
      modelName: "Trip",
    }
  );
  return Trip;
};
