'use strict';
const { v4: uuidv4 } = require('uuid');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class union extends Model {
    static associate(models) {
      union.hasMany(models.chat, { foreignKey: 'unionId' });
      union.belongsToMany(models.user, {
        through: 'user_unions',
        foreignKey: 'unionId',
        otherKey: 'userId'
      });
      union.hasMany(models.workplace, { foreignKey: 'unionId', as: 'associatedWorkplaces' });
    }
  }

  union.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      visibility: {
        type: DataTypes.ENUM('public', 'private'),
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      hooks: {
        afterCreate: async (union, options) => {
          const Chat = sequelize.models.chat;
          const UserUnion = sequelize.models.user_union;
          const pubkey = sequelize.models.pubkey
          const keyVersion = sequelize.models.keyVersion
          try {
            // Use the transaction passed in options, or create a new one
            const transaction = options.transaction || await sequelize.transaction();

            if (!options.userId) {
              throw new Error("User ID not provided in afterCreate hook options");
            }
            const userId = options.userId
            const adminPubkey = await pubkey.findAll({
              where: {
                userId
              }
            })
            const pubkeyValue = adminPubkey[0].dataValues.value
            // Create a general chat for the union
            const newChat = await Chat.create(
              {
                id: uuidv4(),
                name: `${union.name} general chat`,
                unionId: union.id,
                isDefault: true,
                isPublic: true,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              { transaction, userId, pubkeyValue }
            );
            console.log(`Hook triggered: Chat for ${union.name} created`);

            // Create user_union association with admin role
            const newUserUnion = await UserUnion.create(
              {
                id: uuidv4(),
                userId,
                role: 'admin',
                unionId: union.id,
              },
              { transaction }
            );
            console.log(`User ${userId} added to union ${union.id}`);

            if (!options.transaction) {
              await transaction.commit();
            }
          } catch (e) {
            console.error("Error in afterCreate hook:", e);
            if (!options.transaction) {
              await transaction.rollback();
            }
          }
        },
      },
      sequelize,
      modelName: 'union',
      tableName: 'unions',
    }
  );

  return union;
};
