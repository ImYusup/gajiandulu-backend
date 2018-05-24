'use strict';
module.exports = (sequelize, DataTypes) => {
  var Employee = sequelize.define(
    'employees',
    {
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
          key: 'id'
        }
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
        allowNull: true,
        type: DataTypes.INTEGER
      },
      workdays: {
        allowNull: true,
        type: DataTypes.INTEGER
      },
      daily_salary: {
        allowNull: true,
        type: DataTypes.INTEGER
      },
      flag: {
        allowNull: false,
        type: DataTypes.INTEGER(11)
      },
      active: {
        allowNull: false,
        type: DataTypes.TINYINT,
        defaultValue: 1
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
  Employee.associate = function(models) {
    // associations can be defined here
    Employee.belongsTo(models.users, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });
    Employee.belongsTo(models.companies, {
      foreignKey: 'company_id',
      onDelete: 'CASCADE'
    });
    Employee.hasMany(models.feedbacks, {
      foreignKey: 'employee_id',
      onDelete: 'CASCADE'
    });
    Employee.hasMany(models.notifications, {
      foreignKey: 'employee_id',
      onDelete: 'CASCADE'
    });
    Employee.hasMany(models.presences, {
      foreignKey: 'employee_id',
      onDelete: 'CASCADE'
    });
    Employee.hasMany(models.journals, {
      foreignKey: 'employee_id',
      onDelete: 'CASCADE'
    });
  };
  return Employee;
};
