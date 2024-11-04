'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class union extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      union.hasMany(models.chat, { foreignKey: 'unionId' })
      union.belongsToMany(models.user, {
        through: 'user_unions',
        foreignKey: 'unionId',
        otherKey: 'userId'
      })
    }
  }
  union.init({
    name: DataTypes.STRING,
    status: DataTypes.ENUM
  }, {
    sequelize,
    modelName: 'union',
  });
  union.addHook('afterCreate', async (union, options) => {
    const Chat = sequelize.models.chat
    try {
      await Chat.create({
        name: `${union.name} General Chat`,
        unionId: union.id,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
    catch (error) {
      console.log(error)
    }
  })
  return union;
};