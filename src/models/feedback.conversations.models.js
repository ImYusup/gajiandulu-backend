module.exports = (sequelize, DataTypes) => {
  const feedback_conversations = sequelize.define(
    'feedback_conversations', 
    {
      id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      feedback_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        foreignKey: true,
        references: {
          model: 'feedbacks',
          key: 'id'
        }
      },
      commentable_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      commentable_type: {
        allowNull: false,
        type: DataTypes.STRING
      },
      body: {
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

  feedback_conversations.associate = function(models) {
    // associations can be defined here
  };

  return feedback_conversations;
};
