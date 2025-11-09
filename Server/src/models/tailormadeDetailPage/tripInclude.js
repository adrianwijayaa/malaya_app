"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TripInclude extends Model {
    static associate(models) {
      TripInclude.belongsTo(models.Trip, { foreignKey: "TripID", as: "trip" });
    }
  }

  TripInclude.init(
    {
      TripID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Trips", key: "id" },
      },
      label: { type: DataTypes.STRING, allowNull: false },
      sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    {
      sequelize,
      modelName: "TripInclude",
    }
  );

  return TripInclude;
};
