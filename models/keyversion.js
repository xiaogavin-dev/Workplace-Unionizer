'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class keyVersion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      keyVersion.hasMany(models.encrypredKey, {
        foreignKey: 'versionId',
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      })
      keyVersion.hasMany(models.message, {
        foreignKey: 'keyVersionId',
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      })
      keyVersion.belongsTo(models.chat, {
        foreignKey: 'chatKeyVersion', // This matches the chat's chatKeyVersion field
        onDelete: 'SET NULL', // If a chat is deleted, keep the keyVersion
        onUpdate: 'CASCADE'
      });
    }
  }
  keyVersion.init({
    vCount: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'keyVersion',
  });
  return keyVersion;
};