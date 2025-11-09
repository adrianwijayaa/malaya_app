"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TripFact extends Model {
    static associate(models) {
      TripFact.belongsTo(models.Trip, { foreignKey: "TripID", as: "trip" });
    }
  }

  TripFact.init(
    {
      TripID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Trips", key: "id" },
      },
      key: {
        type: DataTypes.ENUM("Accommodation", "Experience", "Safety"),
        allowNull: false,
      },
      value: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "TripFact",
    }
  );

  return TripFact;
};
