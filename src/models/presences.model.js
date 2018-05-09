'use strict';
module.exports = (sequelize, DataTypes) => {
  const Presences = sequelize.define(
    'presences',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      employee_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        foreignKey: true,
        references: {
          model: 'employees',
          key: 'id'
        },
      },
      presence_date: {
        allowNull: false,
        type: DataTypes.DATEONLY
      },
      presence_start: {
        allowNull: false,
        type: DataTypes.DATE
      },
      presence_end: {
        allowNull: false,
        type: DataTypes.DATE
      },
      rest_start: {
        allowNull: false,
        type: DataTypes.DATE
      },
      rest_end: {
        allowNull: false,
        type: DataTypes.DATE
      },
      is_absence: {
        allowNull: false,
        type: DataTypes.TINYINT,
      },
      is_leave: {
        allowNull: false,
        type: DataTypes.TINYINT,
      },
      overwork: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      work_hours: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      salary: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      fine: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
    },
      {
      timestamps: true,
      underscored: true
    }
  );

  // eslint-disable-next-line no-unused-vars
  Presences.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    Presences.belongsTo(models.employees, {
      foreignKey: 'employee_id'
    });
  };

  return Presences;
};
