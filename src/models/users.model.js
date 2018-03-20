module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define(
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
            args: /^[A-Za-z][A-Za-z0-9-]*\s?[A-Za-z][A-Za-z0-9-]*\s?[A-Za-z][A-Za-z0-9-]+$/gi, // must start with letter and only have letters, numbers, dashes
            msg: 'Username must start with a letter and be 3 - 40 characters.'
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
      phone: {
        allowNull: true,
        type: DataTypes.STRING
      },
      is_active_notif: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      is_confirmed_email: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      role_id: {
        allowNull: true,
        type: DataTypes.INTEGER
      },
      hash: {
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

  // eslint-disable-next-line no-unused-vars
  User.associate = function(models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    // User.belongsTo(models.identityCard, { foreignKey: 'identity_card_id' });
    // User.belongsTo(models.role, { foreignKey: 'role_id' });
    // User.belongsTo(models.occupation, { foreignKey: 'occupation_id' });
    // User.belongsTo(models.userFamily, { foreignKey: 'family_id' });
  };

  User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());

    delete values.password;
    return values;
  };

  return User;
};
