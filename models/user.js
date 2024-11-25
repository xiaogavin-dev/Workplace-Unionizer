'use strict';
const {
  Model
} = require('sequelize');
const { v4: uuidv4 } = require('uuid')
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
      user.belongsToMany(models.chat, {
        through: 'user_chats',
        foreignKey: 'userId',
        otherKey: 'chatId'
      })
      user.hasMany(models.message, {
        foreignKey: 'userId',
        onDelete: 'userId',
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      })
      user.hasOne(models.pubkey, {
        foreignKey: 'userId',
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
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
    hooks: {
      afterCreate: async (user, options) => {
        const Pubkey = sequelize.models.pubkey;

        try {
          if (!options.publicKey) {
            throw new Error("public key was never provided")
          }
          const newPubkey = await Pubkey.create({
            id: uuidv4(),
            value: options.publicKey,
            userId: user.uid
          })
          console.log(`public key for use was stored ${newPubkey}`)
        }
        catch (e) {
          console.log(e)
        }
      }
    },
    sequelize,
    modelName: 'user',
  });
  return user;
};