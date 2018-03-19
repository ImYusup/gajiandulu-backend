'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('occupations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      annual_salary_range_max: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      annual_salary_range_min: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      monthly_salary: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      loan_purpose: {
        allowNull: false,
        type: Sequelize.STRING
      },
      company_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      company_address: {
        allowNull: false,
        type: Sequelize.STRING
      },
      company_phone: {
        allowNull: false,
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('occupations');
  }
};
