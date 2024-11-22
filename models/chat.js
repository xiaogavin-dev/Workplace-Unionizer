'use strict';
const {
  Model,
  Sequelize
} = require('sequelize');
const user = require('./user');
module.exports = (sequelize, DataTypes) => {
  class chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      chat.belongsTo(models.union, {
        foreignKey: 'unionId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
      chat.belongsToMany(models.pubkey, {
        through: 'userChats',
        foreignKey: 'chatId',
        otherKey: 'pubkeyValue'
      })
      chat.hasOne(models.keyVersion, {
        foreignKey: 'chatKeyVersion',
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
      })
    }
  }
  chat.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    name: DataTypes.STRING,
    unionId: {
      type: DataTypes.UUID, // Ensure this matches your UUID type in the migration
      allowNull: false,
    },
    chatKeyVersion: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    hooks: {
      afterCreate: async (chat, options) => {
        const user_chat = Sequelize.models.user_chat
        try {
          const newUserChat = user_chat.create({
            userId: options.userId,
            chatId: chat.id,
            pubkeyValue: options.pubkeyValue
          })
          console.log(`new user union chat created`)
          console.log(newUserChat)
        } catch (error) {
          console.log(error)

        }
      }
    },
    sequelize,
    modelName: 'chat',
  });
  return chat;
};