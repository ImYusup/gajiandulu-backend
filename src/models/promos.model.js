module.exports = (sequelize, DataTypes) => {
  const Promo = sequelize.define(
    'promos',
    {
      id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      code: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: 'Please input code' }
        }
      },
      discount: {
        allowNull: false,
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: { msg: 'Please input discount' },
          isNumeric: { msg: 'Please input only format number' }
        }
      },
      expired_date: {
        allowNull: false,
        type: DataTypes.DATEONLY,
        validate: {
          notEmpty: { msg: 'Please input expired date' }
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
  Promo.associate = function(models) {
    // associations can be defined here
  };
  return Promo;
};
