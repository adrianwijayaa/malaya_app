"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class JoinTripExclude extends Model {
    static associate(models) {
      JoinTripExclude.belongsTo(models.JoinTrip, {
        foreignKey: "JoinTripID",
        as: "joinTrip",
        onDelete: "CASCADE",
      });
    }
  }

  JoinTripExclude.init(
    {
      JoinTripID: { type: DataTypes.INTEGER, allowNull: false },
      label: { type: DataTypes.STRING, allowNull: false },
      sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    {
      sequelize,
      modelName: "JoinTripExclude",
      tableName: "JoinTripExcludes",
    }
  );

  return JoinTripExclude;
};
