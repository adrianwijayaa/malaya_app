"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class JoinTrip extends Model {
    static associate(models) {
      JoinTrip.hasMany(models.JoinTripHighlight, {
        foreignKey: "JoinTripID",
        as: "highlights",
      });
      JoinTrip.hasMany(models.JoinTripInclude, {
        foreignKey: "JoinTripID",
        as: "includes",
      });
    }
  }

  JoinTrip.init(
    {
      title: { type: DataTypes.STRING, allowNull: false },
      subtitle: { type: DataTypes.STRING, allowNull: true },
      heroImage: { type: DataTypes.STRING, allowNull: false },
      date: { type: DataTypes.STRING, allowNull: false },
      duration: { type: DataTypes.STRING, allowNull: false },
      location: { type: DataTypes.STRING, allowNull: false },
      groupSize: { type: DataTypes.STRING, allowNull: true },
      activityLevel: { type: DataTypes.STRING, allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: false },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      sequelize,
      modelName: "JoinTrip",
    }
  );

  return JoinTrip;
};
