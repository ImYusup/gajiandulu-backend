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
          notNull: { msg: 'Please insert the type.' }
        }
      },
      debet: {
        allowNull: true,
        type: DataTypes.INTEGER,
        validate: {
          isNumeric: { msg: 'Only Numbers is accepted for Debit Card input.' },
          luhnAlgorithmCheck(value) {
            var nCheck = 0,
              bEven = false;
            value = `${value}`;

            for (var n = value.length - 1; n >= 0; n--) {
              var cDigit = value.charAt(n),
                nDigit = parseInt(cDigit, 10);
              if (bEven) {
                if ((nDigit *= 2) > 9) nDigit -= 9;
              }
              nCheck += nDigit;
              bEven = !bEven;
            }

            if (!(nCheck !== 0 && nCheck % 10 == 0)) {
              throw new Error('Your Debit Card Number is Invalid.');
            }
          }
        }
      },
      kredit: {
        allowNull: true,
        type: DataTypes.INTEGER,
        validate: {
          isNumeric: { msg: 'Only Numbers is accepted for credit card input.' },
          luhnAlgorithmCheck(value) {
            var nCheck = 0,
              bEven = false;
            value = `${value}`;

            for (var n = value.length - 1; n >= 0; n--) {
              var cDigit = value.charAt(n),
                nDigit = parseInt(cDigit, 10);
              if (bEven) {
                if ((nDigit *= 2) > 9) nDigit -= 9;
              }
              nCheck += nDigit;
              bEven = !bEven;
            }

            if (!(nCheck !== 0 && nCheck % 10 == 0)) {
              throw new Error('Your Credit Card Number is Invalid.');
            }
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
