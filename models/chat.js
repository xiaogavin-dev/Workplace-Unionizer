'use strict';
const {
  Model
} = require('sequelize');
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
    }
  }
  chat.init({
    name: DataTypes.STRING,
    unionId: {
      type: DataTypes.UUID, // Ensure this matches your UUID type in the migration
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'chat',
  });
  return chat;
};