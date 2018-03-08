// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function(app) {
  const sequelizeClient = app.get('sequelizeClient');
  const User = sequelizeClient.define(
    'users',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      full_name: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          min: {
            args: 4,
            msg:
              'Username must start with a letter, have no spaces, and be at least 3 characters.'
          },
          max: {
            args: 40,
            msg:
              'Username must start with a letter, have no spaces, and be at less than 40 characters.'
          },
          is: {
            args: /^[A-Za-z][A-Za-z0-9-]+$/i, // must start with letter and only have letters, numbers, dashes
            msg:
              'Username must start with a letter, have no spaces, and be 3 - 40 characters.'
          },
          notEmpty: { msg: 'Please input username' }
        }
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      pin: {
        allowNull: true,
        type: DataTypes.STRING
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING
      },
      date_of_birth: {
        allowNull: false,
        type: DataTypes.DATEONLY,
        validate: {
          isDate: true
        }
      },
      phone_id: {
        allowNull: true,
        type: DataTypes.INTEGER
      },
      is_active_notif: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      is_confirmed_email: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      facebookId: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    },
    {
      hooks: {
        beforeCount(options) {
          options.raw = true;
        }
      }
    }
  );

  // eslint-disable-next-line no-unused-vars
  User.associate = function(models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    // models.phones.hasOne(User, { foreignKey: 'phone_id' });
  };

  return User;
};
