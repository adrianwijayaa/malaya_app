"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Submission extends Model {
    static associate(models) {
      // Foreign key ke PersonalInformation
      Submission.belongsTo(models.PersonalInformation, {
        foreignKey: "PersonalID",
      });
    }
  }

  Submission.init(
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
          model: "PersonalInformation", // Pastikan tabel ini ada di database
          key: "id",
        },
      },
      HowDidYouHear: {
        type: DataTypes.ENUM(
          "GOOGLE_SEARCH",
          "SOCIAL_MEDIA",
          "FRIEND_FAMILY",
          "TRAVEL_BLOG",
          "PREVIOUS_CUSTOMER",
          "TRAVEL_AGENT",
          "ADVERTISEMENT",
          "OTHER"
        ),
        allowNull: false,
      },
      Consent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Submission",
    }
  );

  return Submission;
};
