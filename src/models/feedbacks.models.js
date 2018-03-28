module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define(
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
      underscored: true
    }
  );
  Feedback.associate = function(models) {
    // associations can be defined here
    Feedback.belongsTo(models.users, { foreignKey: 'user_id' });
    Feedback.hasMany(models.feedback_conversations, {
      foreignKey: 'feedback_id',
      as: 'conversations'
    });
  };
  return Feedback;
};
