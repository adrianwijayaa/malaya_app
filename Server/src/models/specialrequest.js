'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SpecialRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define foreign key relationship with TravelDetails
      SpecialRequest.belongsTo(models.TravelDetails, {
        foreignKey: 'TravelDetailsID',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
    }
  }

  SpecialRequest.init({
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
        model: 'TravelDetails', // Sesuaikan dengan nama tabel TravelDetails
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
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
  }, {
    sequelize,
    modelName: 'SpecialRequest',
    tableName: 'SpecialRequests',
    timestamps: false,
  });

  return SpecialRequest;
};
