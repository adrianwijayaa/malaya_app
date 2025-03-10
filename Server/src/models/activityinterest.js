'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ActivityInterest extends Model {
    static associate(models) {
      // Definisikan relasi di sini
      ActivityInterest.belongsTo(models.TravelDetails, {
        foreignKey: 'TravelDetailsID',
        as: 'travelDetail',
      });
    }
  }
  ActivityInterest.init(
    {
      ActivityID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      TravelDetailsID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'TravelDetails', // Nama tabel yang direferensikan
          key: 'id', // Kolom yang direferensikan
        },
      },
      PreferredActivities: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ActivityLevel: {
        type: DataTypes.ENUM('Relaxed (Minimal physical activity)','Moderate (Some Walking, Light Activities)','Active (Regular activities, longer walks)','Challenging (Strenuous activities, hiking)','Mixed (Combination of activity levels)'),
        allowNull: false,
      },
      SpecialInterests: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'ActivityInterest',
    }
  );
  return ActivityInterest;
};