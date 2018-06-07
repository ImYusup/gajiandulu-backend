module.exports = function(sequelize, DataTypes) {
  const Roles = sequelize.define(
    'roles',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      role: {
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

  Roles.associate = function(models) {
    //Roles.hasMany(models.users, { foreignKey: 'role_id' });
  };
  return Roles;
};
