'use strict';
module.exports = (sequelize, DataTypes) => {
  var Employee = sequelize.define('employees', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    company_id: {
      allowNull: false,
      foreignKey: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'companies',
        key: 'id'}
    },
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      foreignKey: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    role: {
      allowNull: false,
      type: DataTypes.INTEGER(11)
    },
    salary: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    flag: {
      allowNull: false,
      type: DataTypes.INTEGER(11)
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
  Employee.associate = function(models) {
    // associations can be defined here
    Employee.belongsTo(models.users, { 
      foreignKey: 'user_id' 
    });
    Employee.belongsTo(models.companies,{ 
      foreignKey: 'company_id'
    });
    Employee.hasMany(models.presences,{ 
      foreignKey: 'presences_id',
      onDelete : 'CASCADE'
    });
  };
  return Employee;
};