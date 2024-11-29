'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Workplace extends Model {
    static associate(models) {
      Workplace.belongsTo(models.union, {
        foreignKey: 'unionId',
        as: 'union',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Workplace.belongsToMany(models.user, {
        through: 'user_workplace',
        foreignKey: 'workplaceId',
        otherKey: 'userId'
      });
    }
  }

  Workplace.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    workplaceName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    organization: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    street: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    addressLine2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    zip: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    unionId: {
      type: DataTypes.UUID,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'workplace',
  });

  return Workplace;
};
