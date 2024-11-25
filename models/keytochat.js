'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class keyToChat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      keyToChat.belongsTo(models.keyVersion, {
        foreignKey: "keyVersionId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      })
      keyToChat.belongsTo(models.chat, {
        foreignKey: "chatId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      })
    }
  }
  keyToChat.init({
    keyVersionId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    chatId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'keyToChat',
  });
  return keyToChat;
};