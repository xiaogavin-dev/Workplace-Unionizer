'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class keyVersion extends Model {
    static associate(models) {
      keyVersion.hasMany(models.encryptedKey, {
        foreignKey: 'versionId',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
      keyVersion.hasMany(models.message, {
        foreignKey: 'keyVersionId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      keyVersion.belongsTo(models.chat, {
        foreignKey: 'chatKeyVersion',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
    }
  }
  keyVersion.init(
    {
      vCount: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'keyVersion',
    }
  );
  return keyVersion;
};
