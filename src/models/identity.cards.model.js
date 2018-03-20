module.exports = function(sequelize, DataTypes) {
  const IdentityCard = sequelize.define('identity_cards', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_id: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    identity_number: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'Please input the identity number' },
        len: {
          args: [6, 16],
          msg: 'Identity number must up to 16 digits'
        },
        isNumeric: { msg: 'Please input only number format' }
      }
    },
    address: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'Please input the identity address' },
        len: {
          args: [0, 255],
          msg: 'Identity address is too long, maximum is 255 characters'
        }
      }
    },
    city: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'Please input the city name' },
        len: {
          args: [0, 100],
          msg: 'City name is too long, maximum is 100 characters'
        },
        is: {
          args: /^([A-z]|\s)+$/gi,
          msg: 'City name must be alphabethical characters'
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
  });

  IdentityCard.associate = function(models) {
    IdentityCard.belongsTo(models.users, { foreignKey: 'user_id' });
  };

  return IdentityCard;
};
