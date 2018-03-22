module.exports = function(sequelize, DataTypes) {
  const DigitalAsset = sequelize.define(
    'digital_assets',
    {
      id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
      type: {
        allowNull: false,
        type: DataTypes.STRING
      },
      path: {
        allowNull: false,
        type: DataTypes.STRING
      },
      filename: {
        allowNull: false,
        type: DataTypes.STRING
      },
      url: {
        allowNull: true,
        type: DataTypes.STRING,
        defaultValue: null
      },
      mime_type: {
        allowNull: true,
        type: DataTypes.STRING
      },
      is_verified: {
        allowNull: true,
        type: DataTypes.BOOLEAN
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
  DigitalAsset.associate = function(models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return DigitalAsset;
};
