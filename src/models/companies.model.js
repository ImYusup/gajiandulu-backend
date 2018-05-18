'use strict';
module.exports = (sequelize, DataTypes) => {
  var Company = sequelize.define(
    'companies',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      codename: {
        allowNull: false,
        type: DataTypes.STRING
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING
      },
      address: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      phone: {
        allowNull: false,
        type: DataTypes.STRING
      },
      timezone: {
        allowNull: false,
        defaultValue: 'Asia/Jakarta',
        type: DataTypes.STRING
      },
      location: {
        allowNull: false,
        type: DataTypes.STRING
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },
    {
      timestamps: true,
      underscored: true
    }
  );

  Company.associate = function(models) {
    // associations can be defined here
    Company.hasMany(models.employees, {
      foreignKey: 'company_id',
      onDelete: 'CASCADE'
    });
    Company.hasOne(models.company_settings, {
      foreignKey: 'company_id',
      onDelete: 'CASCADE'
    });
  };
  return Company;
};
