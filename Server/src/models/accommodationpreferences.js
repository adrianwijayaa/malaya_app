'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AccommodationPreferences extends Model {
    static associate(models) {
      // Define association here
      AccommodationPreferences.belongsTo(models.TravelDetails, {
        foreignKey: 'TravelDetailsID',
        as:'Travel Detail'
      });
    }
  }

  AccommodationPreferences.init(
    {
      AccommodationID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      TravelDetailsID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'TravelDetails',
          key: 'id',
        },
      },
      PreferredAccommodationType: {
        type: DataTypes.ENUM('Luxury Resort','Boutique Hotel','Private Villa','Guest House','Eco Lodge','Glamping','Traditional Stay'),
        allowNull: false,
      },
      RoomType: {
        type: DataTypes.ENUM('Standard Room','Deluxe Room','Suite','Family Room','Pool Villa','Ocean View Room','Garden View Room','Connecting Room'),
        allowNull: false,
      },
      SpecialAccommodationRequests: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'AccommodationPreferences',
      tableName: 'AccommodationPreferences',
      timestamps: true,
    }
  );

  return AccommodationPreferences;
};
