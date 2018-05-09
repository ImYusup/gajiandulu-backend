'use strict';
module.exports = (sequelize, DataTypes) => {
  var Journals = sequelize.define('journals', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    employee_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      foreignKey: true,
      references: {
        model: 'employees',
        key: 'id'
      }
    },
    type: {
      allowNull: false,
      type: DataTypes.STRING(45)
    },
    debet: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    kredit: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    timestamps: true,
    underscored: true,
  });
  Journals.associate = function(models) {
    // associations can be defined here
    Journals.belongsTo(models.employees, { 
      foreignKey: 'employee_id',
      onDelete: 'CASCADE' 
    });
  };
  return Journals;
};