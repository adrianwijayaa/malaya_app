"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TripPriceDetail extends Model {
    static associate(models) {
      TripPriceDetail.belongsTo(models.Trip, {
        foreignKey: "TripID",
        as: "trip",
        onDelete: "CASCADE",
      });
    }
  }

  TripPriceDetail.init(
    {
      TripID: { type: DataTypes.INTEGER, allowNull: false },
      pax: { type: DataTypes.STRING, allowNull: false },
      price: { type: DataTypes.STRING, allowNull: false },
      sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    {
      sequelize,
      modelName: "TripPriceDetail",
      tableName: "TripPriceDetails",
    }
  );

  return TripPriceDetail;
};
