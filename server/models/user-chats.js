'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userChat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      userChat.belongsTo(models.user, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      userChat.belongsTo(models.chat, {
        foreignKey: 'chatId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      userChat.belongsTo(models.pubkey, {
        foreignKey: 'pubkeyValue',
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      })
    }
  }
  userChat.init({
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    chatId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    pubkeyValue: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('general', 'admin'),
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'user_chat',
  });
  return userChat;
};