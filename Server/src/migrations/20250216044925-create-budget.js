'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Budgets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      TravelDetailsID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'TravelDetails', // Sesuaikan dengan nama tabel TravelDetails
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      EstimatedBudgetPerPerson: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      Currency: {
        type: Sequelize.ENUM('USD - US Dollar','EUR - Euro','GBP - British Pound','IDR - Indonesian Rupiah', 'JPY - Japanese Yen','AUD - Australian Dollar','SGD - Singapore Dollar','MYR - Malaysian Ringgit','CNY - Chinese Yuan'),
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Budgets');
  }
};
