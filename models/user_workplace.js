'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class user_workplace extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      user_workplace.belongsTo(models.user, {
        foreignKey: 'userId',
        targetKey: 'uid',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });

      user_workplace.belongsTo(models.workplace, {
        foreignKey: 'workplaceId',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
    }
  }

  user_workplace.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      workplaceId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('general', 'admin'),
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'user_workplace',
      tableName: 'user_workplaces',
    }
  );

  return user_workplace;
};
