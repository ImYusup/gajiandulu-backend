'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('loans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        foreignKey: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      ammount: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      period: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      service_charge: {
        allowNull: false,
        type: Sequelize.STRING
      },
      interest_rate: {
        allowNull: false,
        type: Sequelize.DECIMAL
      },
      interest_charge: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      due_date_charge:{
        allowNull: false,
        type: Sequelize.INTEGER
      },
      total:{
        allowNull: false,
        type: Sequelize.INTEGER
      },
      purpose:{
        allowNull: false,
        type: Sequelize.ENUM('pendidikan', 'konsumsi', 'modal', 'liburan', 'menikah', 'medis', 'kendaraan', 'lainnya')
      },
      materai_charge:{
        allowNull: false,
        type: Sequelize.STRING
      },
      due_date:{
        allowNull: false,
        type: Sequelize.DATE
      },
      promo_code:{
        allowNull: false,
        type: Sequelize.STRING
      },
      promo_discount:{
        allowNull: false,
        type: Sequelize.INTEGER
      },
      paid:{
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      status:{
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      created_at:{
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at:{
        alloNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('loans');
  }
};
