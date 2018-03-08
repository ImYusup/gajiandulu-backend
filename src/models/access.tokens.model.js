// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function(app) {
  const sequelizeClient = app.get('sequelizeClient');
  const AccessToken = sequelizeClient.define(
    'access_tokens',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
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
      access_token: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      refresh_token: {
        allowNull: false,
        type: DataTypes.STRING
      },
      expiry_in: {
        allowNull: true,
        type: DataTypes.INTEGER
      },
      client_id: {
        allowNull: true,
        type: DataTypes.STRING
      },
      client_secret: {
        allowNull: true,
        type: DataTypes.STRING
      },
      provider: {
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
      hooks: {
        beforeCount(options) {
          options.raw = true;
        }
      }
    }
  );

  // eslint-disable-next-line no-unused-vars
  AccessToken.associate = function(models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    AccessToken.belongsTo(models.users, { foreignKey: 'user_id' });
  };

  return AccessToken;
};
