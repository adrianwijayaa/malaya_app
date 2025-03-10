"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TravelDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TravelDetails.belongsTo(models.PersonalInformation, {
        foreignKey: "PersonalID", // Kolom foreign key di TravelDetails
        as: "personalInfo", // Alias untuk relasi
      });
    }
  }

  TravelDetails.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      PersonalID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "PersonalInformation",
          key: "id",
        },
      },
      PreferredDestinations: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      PreferredStartDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      FlexibleDates: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      TripDurationDays: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Adults: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Children: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ChildrenAges: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "TravelDetails",
    }
  );

  return TravelDetails;
};
