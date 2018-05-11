
module.exports = (sequelize, DataTypes) => {
  const Loan = sequelize.define('loans',
    {
      id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        allowNull: true,
        type: DataTypes.INTEGER
      },
      amount: {
        allowNull: false,
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: {msg: 'Please input amount'},
          isNumeric: {msg: 'Please input only format number'}
        }
      },
      period: {
        allowNull: false,
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: {msg: 'Please input period'},
          isNumeric: {msg: 'Please input only number format'}
        }
      },
      service_charge: {
        allowNull: false,
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: {msg: 'Please input service charge'},
          isNumeric: {msg: 'Please input only number format '}
        }
      },
      interest_rate: {
        allowNull: false,
        type: DataTypes.DECIMAL,
        validate: {
          notEmpty: {msg: 'Please input interest rate'},
          isDecimal: {msg: 'Please inout only decimal format'}
        }
      },
      interest_charge: {
        allowNull: false,
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: {msg: 'Please input interest charge'},
          isNumeric: {msg: 'Please input only number format'}
        }
      },
      due_date_charge: {
        allowNull: true,
        type: DataTypes.INTEGER,
        validate: {
          isNumeric: {msg: 'Please input only number format'}
        }
      },
      total: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      purpose: {
        allowNull: false,
        type: DataTypes.STRING,
        notEmpty: { msg: 'Please input the purpose' },
        len: {
          args: [0, 45],
          msg: 'Purpose is too long, maximum is 45 characters'
        }
      },
      materai_charge: {
        allowNull: false,
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: {msg: 'Please input due materai'}
        }
      },
      due_date: {
        allowNull: false,
        type: DataTypes.DATE,
        validate: {
          notEmpty: {msg: 'Please input due date'}
        }
      },
      promo_code: {
        allowNull: true,
        type: DataTypes.STRING
      },
      promo_discount: {
        allowNull: true,
        type: DataTypes.INTEGER
      },
      paid: {
        allowNull: false,
        type: DataTypes.TINYINT,
        validate: {
          notEmpty: {msg: 'Please input paid'}
        }
      },
      status: {
        allowNull: false,
        type: DataTypes.TINYINT
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
  Loan.associate = function(models) {
    Loan.belongsTo(models.users, {foreignKey: 'user_id'});
    // associations can be defined here
  };
  return Loan;
};
