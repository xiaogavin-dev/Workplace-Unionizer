'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class encryptedKey extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      encryptedKey.belongsTo(models.keyVersion, {
        foreignKey: 'versionId',
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      })
      encryptedKey.belongsTo(models.pubkey, {
        foreignKey: "pubkeyValue",
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      })
      encryptedKey.belongsTo(models.chat, {
        foreignKey: 'chatId',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      })
    }
  }
  encryptedKey.init({
    encryptedKey: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pubkeyValue: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    versionId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    chatId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'encryptedKey',
  });
  return encryptedKey;
};