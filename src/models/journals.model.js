'use strict';
module.exports = (sequelize, DataTypes) => {
  var Journals = sequelize.define(
    'journals',
    {
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
        type: DataTypes.STRING(45),
        validate: {
          notNull: { msg: 'Please input type.' }
        }
      },
      debet: {
        allowNull: true,
        type: DataTypes.INTEGER,
        validate: {
          isNumeric: { msg: 'Only Numbers is accepted for Debit Card input.' },
          min: {
            args: 0,
            msg: 'Input cannot be a negative number.'
          }
        }
      },
      kredit: {
        allowNull: true,
        type: DataTypes.INTEGER,
        validate: {
          isNumeric: { msg: 'Only Numbers is accepted for Credit Card input.' },
          min: {
            args: 0,
            msg: 'Input cannot be a negative number.'
          }
        }
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
  Journals.associate = function(models) {
    // associations can be defined here
    Journals.belongsTo(models.employees, {
      foreignKey: 'employee_id',
      onDelete: 'CASCADE'
    });
    Journals.hasOne(models.journal_details, {
      foreignKey: 'journal_id',
      onDelete: 'CASCADE'
    });
  };
  return Journals;
};
