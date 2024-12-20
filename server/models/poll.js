'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class poll extends Model {
    static associate(models) {
      poll.belongsTo(models.union, {
        foreignKey: 'unionId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      poll.belongsTo(models.workplace, {
        foreignKey: 'workplaceId',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
    }
  }

  poll.init({
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
    yesCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    noCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    // Default poll to unionize 
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    workplaceId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'workplaces',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    unionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'unions',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  }, {
    sequelize,
    modelName: 'poll',
    tableName: 'polls',
  });

  return poll;
};