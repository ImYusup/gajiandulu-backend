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
        allowNull: true,
        type: DataTypes.STRING,
      },
      summary: {
        allowNull: false,
        type: DataTypes.STRING
      },
      status: {
        type: DataTypes.ENUM('pending', 'verified'),
        defaultValue: 'pending'
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
      underscored: true,
      hooks: {
        afterCreate: (feedback, options) => {
          feedbacks.update(
            { ticket_number: '#'+feedback.id },
            { where: { id: feedback.id } }
          );
        }
      }
    }
  );
  feedbacks.associate = function(models) {
    // associations can be defined here
  };
  return feedbacks;
};
