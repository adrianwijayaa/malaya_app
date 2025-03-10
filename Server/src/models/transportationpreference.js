"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TransportationPreference extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TransportationPreference.belongsTo(models.TravelDetails, {
        foreignKey: "TravelDetailsID",
        as: "travelDetail",
      });
    }
  }

  TransportationPreference.init(
    {
      TravelDetailsID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "TravelDetails",
          key: "id",
        },
      },
      InternationalFlightRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      DepartureCity: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      DomesticFlightRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      DomesticDepartureCity: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      PreferredTransportType: {
        type: DataTypes.ENUM(
          "Private Car with Driver",
          "Shared Van/Bus Service",
          "Self-Drive Rental Car",
          "Motorcycle Rental",
          "Boat/Ferry Service",
          "Luxury Vehicle Service",
          "Mixed Transportation"
        ),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "TransportationPreference",
    }
  );

  return TransportationPreference;
};
