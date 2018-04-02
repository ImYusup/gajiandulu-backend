module.exports = function(sequelize, DataTypes) {
  const UserFamily = sequelize.define(
    'families',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
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
      name: {
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
      relative_type: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'Please input relative_type' }
        }
      },
      address: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'Please input address' }
        }
      },
      phone: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
        validate: {
          notEmpty: { msg: 'Please input phone' }
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

  // eslint-disable-next-line no-unused-vars
  UserFamily.associate = function(models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    UserFamily.belongsTo(models.users, {
      foreignKey: 'user_id'
    });
  };

  return UserFamily;
};
