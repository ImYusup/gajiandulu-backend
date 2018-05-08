'use strict';
module.exports = (sequelize, DataTypes) => {
  var Employees = sequelize.define('emplooyees', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    company_id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
      references: {
        model: 'companies',
        key: 'id'}
    },
    user_id: {
      allowNull: true,
      foreignKey: true,
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'}
    },
    role: {
      allowNull: false,
      type: Sequelize.INTEGER(11)
    },
    salary: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    flag: {
      allowNull: false,
      type: Sequelize.INTEGER(11)
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }, {
    underscored: true,
  });
  Employees.associate = function(models) {
    // associations can be defined here
  Employees.belongsTo(models.users,{
    foreignKey: 'user_id'
  });
  Employees.belongsTo(models.companies,{
    foreignKey: 'company_id'
  });
  };
  return Employees;
};