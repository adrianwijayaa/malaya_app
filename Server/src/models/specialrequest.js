"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SpecialRequest extends Model {
    static associate(models) {
      SpecialRequest.belongsTo(models.TravelDetails, {
        foreignKey: "TravelDetailsID",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  }

  SpecialRequest.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      TravelDetailsID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "TravelDetails",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      OccasionsToCelebrate: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      AdditionalServicesNeeded: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      SpecialRequestsNotes: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "SpecialRequest",
      tableName: "SpecialRequests",
      timestamps: false,
    }
  );

  return SpecialRequest;
};
