'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pubkey extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      pubkey.belongsTo(models.user, {
        foreignKey: "userId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      })
      pubkey.belongsToMany(models.chat, {
        through: 'user_chats',
        foreignKey: 'pubkeyValue',
        otherKey: 'chatId'
      })
      pubkey.hasMany(models.encryptedKey, {
        foreignKey: 'pubkeyValue',
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      })
    }
  }
  pubkey.init({
    value: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'pubkey',
  });
  return pubkey;
};