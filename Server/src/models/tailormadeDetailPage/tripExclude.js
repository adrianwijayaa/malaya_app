"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TripExclude extends Model {
    static associate(models) {
      TripExclude.belongsTo(models.Trip, {
        foreignKey: "TripID",
        as: "trip",
        onDelete: "CASCADE",
      });
    }
  }

  TripExclude.init(
    {
      TripID: { type: DataTypes.INTEGER, allowNull: false },
      label: { type: DataTypes.STRING, allowNull: false },
      sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    {
      sequelize,
      modelName: "TripExclude",
      tableName: "TripExcludes",
    }
  );

  return TripExclude;
};
