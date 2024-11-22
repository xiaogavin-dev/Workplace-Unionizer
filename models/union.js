'use strict';
const { v4: uuidv4 } = require('uuid')
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
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    name: DataTypes.STRING,
    status: DataTypes.ENUM("union", 'pending'),
    location: DataTypes.STRING,
    organization: DataTypes.STRING
  }, {
    hooks: {
      afterCreate: async (union, options) => {
        const Chat = sequelize.models.chat;
        const UserUnion = sequelize.models.user_union;
        const pubkey = sequelize.models.pubkey
        const keyVersion = sequelize.models.keyVersion
        // Start a transaction to ensure both actions succeed together
        const transaction = await sequelize.transaction();
        try {
          if (!options.userId) {
            throw new Error("User ID not provided in afterCreate hook options");
          }
          const userId = options.userId
          const adminPubkey = pubkey.findAll({
            where: {
              userId
            }
          })
          const pubkeyValue = adminPubkey[0].dataValues.value
          const newKeyVersion = keyVersion.create({
            vCount: 1
          })
          // Create the chat associated with the union
          const newChat = await Chat.create(
            {
              id: uuidv4(),
              name: `${union.name} general chat`,
              unionId: union.id,
              chatkeyVersion: newKeyVersion.id,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            { transaction, userId, pubkeyValue, newKeyVersion }
          );
          console.log(`Hook triggered: Chat for ${union.name} created`);



          const newUserUnion = await UserUnion.create(
            {
              id: uuidv4(),
              userId: options.userId,
              role: "admin",
              unionId: union.id
            },
            { transaction }
          );
          console.log(`User ${options.userId} added to union ${union.id}`);

          await transaction.commit();
        } catch (e) {
          console.error("Error in afterCreate hook:", e);
          await transaction.rollback();
        }
      }
    },
    sequelize,
    modelName: 'union',
  });
  return union;
};