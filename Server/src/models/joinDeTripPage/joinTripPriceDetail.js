"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class JoinTripPriceDetail extends Model {
    static associate(models) {
      JoinTripPriceDetail.belongsTo(models.JoinTrip, {
        foreignKey: "JoinTripID",
        as: "joinTrip",
        onDelete: "CASCADE",
      });
    }
  }

  JoinTripPriceDetail.init(
    {
      JoinTripID: { type: DataTypes.INTEGER, allowNull: false },
      pax: { type: DataTypes.STRING, allowNull: false },
      price: { type: DataTypes.STRING, allowNull: false },
      sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    {
      sequelize,
      modelName: "JoinTripPriceDetail",
      tableName: "JoinTripPriceDetails",
    }
  );

  return JoinTripPriceDetail;
};
