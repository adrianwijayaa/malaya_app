"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TripHighlight extends Model {
    static associate(models) {
      TripHighlight.belongsTo(models.Trip, {
        foreignKey: "TripID",
        as: "trip",
      });
    }
  }

  TripHighlight.init(
    {
      TripID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Trips", key: "id" },
      },
      imageUrl: { type: DataTypes.STRING, allowNull: false },
      caption: { type: DataTypes.STRING, allowNull: false },
      sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    {
      sequelize,
      modelName: "TripHighlight",
    }
  );

  return TripHighlight;
};
