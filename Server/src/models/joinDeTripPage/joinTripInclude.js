"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class JoinTripInclude extends Model {
    static associate(models) {
      JoinTripInclude.belongsTo(models.JoinTrip, {
        foreignKey: "JoinTripID",
        as: "trip",
      });
    }
  }

  JoinTripInclude.init(
    {
      JoinTripID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "JoinTrips", key: "id" },
      },
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    {
      sequelize,
      modelName: "JoinTripInclude",
    }
  );

  return JoinTripInclude;
};
