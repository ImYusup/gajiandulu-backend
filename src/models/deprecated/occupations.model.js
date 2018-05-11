module.exports = function(sequelize, DataTypes) {
  const Occupation = sequelize.define(
    'occupations',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: 'Please input occupation name'
          },
          len: {
            args: [0, 100],
            msg: 'Maximum occupation name is 100 character'
          },
          is: {
            args: /^([A-z]|\s)+$/gi,
            msg: 'Occupation name must be alphabethical character'
          }
        }
      },
      annual_salary_range_max: {
        allowNull: false,
        type: DataTypes.BIGINT,
        validate: {
          isNumeric: { msg: 'Please input number only character' },
          notEmpty: { msg: 'Please input maximum annual salary range' },
          is: {
            args: /^\d{0,10}$/g,
            msg: 'Maximum annual salary number only up to 10 digits'
          }
        }
      },
      annual_salary_range_min: {
        allowNull: false,
        type: DataTypes.BIGINT,
        validate: {
          isNumeric: { msg: 'Please input number only character' },
          notEmpty: { msg: 'Please input minimum annual salary range' },
          is: {
            args: /^\d{0,10}$/g,
            msg: 'Minimum annual salary number only up to 10 digits'
          }
        }
      },
      monthly_salary: {
        allowNull: false,
        type: DataTypes.BIGINT,
        validate: {
          isNumeric: { msg: 'Please input number only character' },
          notEmpty: { msg: 'Please input monthly salary' },
          is: {
            args: /^\d{0,40}$/g,
            msg: 'Monthly salary number only up to 40 digits'
          }
        }
      },
      loan_purpose: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'Please input the purpose of lending' },
          len: {
            args: [4, 140],
            msg: 'Purpose to loan must between 4 up to 140 characters'
          },
          is: {
            args: /^([A-z]|\s)+$/gi,
            msg: 'Purpose to loan must be alphabethical character'
          }
        }
      },
      company_name: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'Please input the company name' },
          len: {
            args: [0, 100],
            msg: 'Company is too long, maximum is 100 characters'
          },
          is: {
            args: /^([A-z]|\s)+$/gi,
            msg: 'Company name must be alphabethical characters'
          }
        }
      },
      position: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'Please input the position name' },
          len: {
            args: [0, 100],
            msg: 'Position name is too long, maximum is 100 characters'
          },
          is: {
            args: /^([A-z]|\s)+$/gi,
            msg: 'Position name must be alphabethical characters'
          }
        }
      },
      company_address: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'Please input the company address' },
          len: {
            args: [0, 255],
            msg: 'Company address is too long, maximum is 255 characters'
          }
        }
      },
      company_phone: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'Please input the company phone number' },
          len: {
            args: [5, 15],
            msg: 'Phone number must between 5 up to 15 digits'
          },
          isNumeric: { msg: 'Please input only number format' }
        }
      },
      user_id: {
        allowNull: true,
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
    },
    {
      timestamps: true,
      underscored: true
    }
  );

  Occupation.associate = function(models) {
    Occupation.hasOne(models.users, { foreignKey: 'occupation_id' });
  };

  return Occupation;
};
