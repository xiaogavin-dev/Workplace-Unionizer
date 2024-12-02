'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class poll extends Model {
    static associate(models) {
      poll.belongsTo(models.union, {
        foreignKey: 'unionId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  poll.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      options: {
        type: DataTypes.ARRAY(DataTypes.STRING), 
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'poll',
      tableName: 'polls',
    }
  );

  return poll;
};
