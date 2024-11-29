'use strict';
const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  class chat extends Model {
    static associate(models) {
      chat.belongsTo(models.union, {
        foreignKey: 'unionId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      // Users participating in the chat
      chat.belongsToMany(models.pubkey, {
        through: 'userChats',
        foreignKey: 'chatId',
        otherKey: 'pubkeyValue',
      });
      // Current key version
      chat.hasOne(models.keyVersion, {
        sourceKey: 'chatKeyVersion'
      });
      chat.hasMany(models.encryptedKey, {
        foreignKey: 'chatId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
    }
  }
  chat.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      unionId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      chatKeyVersion: {
        type: DataTypes.UUID,
        allowNull: true, // Allow null for backward compatibility
      },
      isDefault: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
      isPublic: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1
      }
    },
    {
      hooks: {
        afterCreate: async (chat, options) => {
          const { user_chat } = sequelize.models;
          const transaction = options.transaction
          try {
            // Add the user to the chat
            const newUserChat = await user_chat.create({
              id: uuidv4(),
              userId: options.userId,
              chatId: chat.id,
              role: 'admin',
              pubkeyValue: options.pubkeyValue,
            }, { transaction });

            console.log(`User-Chat association created:`, newUserChat);
          } catch (error) {
            console.error('Error in Chat afterCreate hook:', error);
            if (options.transaction) {
              await options.transaction.rollback();
            }
          }
        },
      },
      sequelize,
      modelName: 'chat',
    }
  );
  return chat;
};
