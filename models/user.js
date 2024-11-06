'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.belongsToMany(models.union, {
        through: 'user_unions',
        foreignKey: 'userId',
        otherKey: 'unionId'
      })
      user.hasMany(models.message, {
        foreignKey: 'userId',
        onDelete: 'userId',
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      })
    }
  }
  user.init({
    uid: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    email: DataTypes.STRING,
    displayName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};