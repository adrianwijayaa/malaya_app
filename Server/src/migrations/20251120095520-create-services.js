'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Services', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      price: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Display price like "From $50"',
      },
      rating: {
        type: Sequelize.DECIMAL(2, 1),
        allowNull: false,
        defaultValue: 4.5,
      },
      reviews: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      detailDescription: {
        type: Sequelize.TEXT('long'),
        allowNull: true,
        comment: 'Long description for detail page',
      },
      packages: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Array of package objects with id, name, price, duration, description, features',
      },
      valueProps: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Array of value proposition objects with icon, title, desc',
      },
      testimonials: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Array of testimonial objects with id, name, rating, text',
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Add index for slug for faster lookups
    await queryInterface.addIndex('Services', ['slug']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Services');
  },
};
