"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class JoinTripHighlight extends Model {
    static associate(models) {
      JoinTripHighlight.belongsTo(models.JoinTrip, {
        foreignKey: "JoinTripID",
        as: "trip",
      });
    }
  }

  JoinTripHighlight.init(
    {
      JoinTripID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "JoinTrips", key: "id" },
      },
      imageUrl: { type: DataTypes.STRING, allowNull: false },
      text: { type: DataTypes.STRING, allowNull: false },
      sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    {
      sequelize,
      modelName: "JoinTripHighlight",
    }
  );

  return JoinTripHighlight;
};
