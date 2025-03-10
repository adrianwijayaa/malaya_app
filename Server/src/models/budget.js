'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Budget extends Model {
    static associate(models) {
      // Relasi ke TravelDetails
      Budget.belongsTo(models.TravelDetails, {
        foreignKey: 'TravelDetailsID',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
    }
  }

  Budget.init({
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
        model: 'TravelDetails', // Pastikan tabel TravelDetails sudah ada
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    EstimatedBudgetPerPerson: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    Currency: {
      type: DataTypes.ENUM('USD - US Dollar','EUR - Euro','GBP - British Pound','IDR - Indonesian Rupiah', 'JPY - Japanese Yen','AUD - Australian Dollar','SGD - Singapore Dollar','MYR - Malaysian Ringgit','CNY - Chinese Yuan'),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Budget',
    tableName: 'Budgets',
    timestamps: false,
  });

  return Budget;
};
