'use strict';
module.exports = (sequelize, DataTypes) => {
  var JournalDetail = sequelize.define(
    'journal_details',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      journal_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        foreignKey: true,
        references: {
          model: 'journals',
          key: 'id'
        }
      },
      tax: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: {
            msg: 'Tax must be an Integer.'
          }
          // min: {
          //   args: 0,
          //   msg: 'Tax cannot be a negative number.'
          // }
        }
      },
      fee: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: {
            msg: 'Fee must be an Integer.'
          }
          // min: {
          //   args: 0,
          //   msg: 'Fee cannot be a negative number.'
          // }
        }
      },
      promo_id: {
        type: DataTypes.INTEGER
      },
      promo_applied: {
        type: DataTypes.INTEGER
      },
      total: {
        type: DataTypes.INTEGER
      },
      total_nett: {
        type: DataTypes.INTEGER
      },
      status: {
        type: DataTypes.TINYINT(2)
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
  JournalDetail.associate = function(models) {
    // associations can be defined here
    JournalDetail.belongsTo(models.journals, {
      foreignKey: 'journal_id',
      onDelete: 'CASCADE'
    });
  };
  return JournalDetail;
};
