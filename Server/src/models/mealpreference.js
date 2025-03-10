"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MealPreference extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define foreign key relationship
      MealPreference.belongsTo(models.TravelDetails, {
        foreignKey: "TravelDetailsID",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  MealPreference.init(
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
          model: "TravelDetails", // Name of the referenced table
          key: "id", // Primary key in TravelDetails
        },
      },
      DietaryRestrictions: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      MealPlanPreferences: {
        type: DataTypes.ENUM(
          "All-Inclusive (All Meals)",
          "Breakfast Only",
          "Half Board (Breakfast & Dinner)",
          "Full Board (All Meals)",
          "Pay As You Go",
          "Custom Plan"
        ),
        allowNull: false,
      },
      SpecialFoodRequests: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "MealPreference",
    }
  );

  return MealPreference;
};
