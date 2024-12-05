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
        otherKey: 'userId',
      });
      union.hasMany(models.workplace, {
        foreignKey: 'unionId',
        as: 'associatedWorkplaces',
      });
      union.hasMany(models.formQuestion, {
        foreignKey: 'unionId',
        as: 'formQuestions',
      });
      union.hasMany(models.poll, {
        foreignKey: 'unionId',
        as: 'polls',
      });
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
          const { chat: Chat, user_union: UserUnion, poll: Poll, pubkey: Pubkey } = sequelize.models;

          try {
            const transaction = options.transaction || (await sequelize.transaction());

            if (!options.userId) {
              throw new Error("User ID not provided in afterCreate hook options");
            }

            const userId = options.userId;

            // Fetch admin pubkey
            const adminPubkey = await Pubkey.findOne({ where: { userId }, transaction });
            if (!adminPubkey) {
              throw new Error("Admin public key not found");
            }
            const pubkeyValue = adminPubkey.dataValues.value;

            // Create general chats for the union
            await Chat.create(
              {
                id: uuidv4(),
                name: `${union.name} general chat`,
                unionId: union.id,
                isDefault: true,
                isPublic: true,
              },
              { transaction, userId, pubkeyValue }
            );

            console.log(`General chat created for union: ${union.name}`);

            await Chat.create(
              {
                id: uuidv4(),
                name: `${union.name} workplace 1 chat`,
                unionId: union.id,
                isDefault: true,
                isPublic: true,
              },
              { transaction, userId, pubkeyValue }
            );

            console.log(`General chat created for workplace1: ${union.name}`);

            // Create a default poll for the union
            await Poll.create(
              {
                id: uuidv4(),
                name: `Poll for ${union.name}`,
                unionId: union.id,
                description: "Poll to unionize.",
                options: ["yes", "no"], 
                isActive: true,
              },
              { transaction }
            );

            console.log(`Poll created for union: ${union.name}`);

            // Associate the user with the union as admin
            await UserUnion.create(
              {
                id: uuidv4(),
                userId,
                role: "admin",
                unionId: union.id,
              },
              { transaction }
            );

            console.log(`Admin user associated with union: ${union.name}`);

            // Commit transaction if it was created in the hook
            if (!options.transaction) {
              await transaction.commit();
            }
          } catch (error) {
            console.error("Error in afterCreate hook:", error);

            if (!options.transaction) {
              await transaction.rollback();
            }

            throw error;
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
