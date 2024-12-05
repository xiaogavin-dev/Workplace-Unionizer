'use strict';
const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid')
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
        foreignKey: 'chatId',
      });
    }
  }
  keyVersion.init(
    {
      vCount: DataTypes.INTEGER,
      chatId: {
        type: DataTypes.UUID,
        allowNull: false
      }
    },
    {
      hooks: {
        afterCreate: async (keyVersion, options) => {
          const { encryptedKeys, chatId } = options
          const { encryptedKey } = sequelize.models
          const newEncryptedKeyArray = []
          for (const publicKey in encryptedKeys) {
            const newEncryptedKey = await encryptedKey.create({
              id: uuidv4(),
              encryptedKey: encryptedKeys[publicKey],
              pubkeyValue: publicKey,
              chatId,
              versionId: keyVersion.id
            })
            newEncryptedKeyArray.push(newEncryptedKey)
          }
        }
      },
      sequelize,
      modelName: 'keyVersion',
    }
  );
  return keyVersion;
};
