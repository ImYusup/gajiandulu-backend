'use strict';
module.exports = (sequelize, DataTypes) => {
  var notifications = sequelize.define('notifications', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    employee_id: {
      type: DataTypes.INTEGER
    },
    body: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    underscored: true,
  });
  notifications.associate = function(models) {
    // associations can be defined here
    notifications.belongsTo(models.employee, { 
      foreignKey: 'employee_id',
      onDelete: 'CASCADE' 
    });
  };
  return notifications;
};