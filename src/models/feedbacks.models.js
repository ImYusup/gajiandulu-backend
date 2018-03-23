module.exports = (sequelize, DataTypes) => {
  const feedbacks = sequelize.define(
    'feedbacks', 
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
      ticket_number: {
        allowNull: false,
        type: DataTypes.BIGINT
      },
      summary: {
        allowNull: false,
        type: DataTypes.STRING
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
    });
  feedbacks.associate = function(models) {
    // associations can be defined here
  };
  return feedbacks;
};
