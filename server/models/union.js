'use strict';
const {
  v4: uuidv4
} = require('uuid');
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class union extends Model {
    static associate(models) {
      union.hasMany(models.chat, {
        foreignKey: 'unionId',
        onDelete: 'CASCADE',
        onUpdate: "CASCADE"
      });
      union.belongsToMany(models.user, {
        through: 'user_unions',
        foreignKey: 'unionId',
        otherKey: 'userId',
      });
      union.hasMany(models.workplace, {
        foreignKey: 'unionId',
        as: 'associatedWorkplaces',
        onDelete: 'CASCADE',
        onUpdate: "CASCADE"
      });
      union.hasMany(models.formQuestion, {
        foreignKey: 'unionId',
        as: 'formQuestions',
        onDelete: 'CASCADE',
        onUpdate: "CASCADE"
      });
      union.hasMany(models.poll, {
        foreignKey: 'unionId',
        as: 'polls',
        onDelete: 'CASCADE',
        onUpdate: "CASCADE"
      });
    }
  }

  union.init({
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
  }, {
    hooks: {
      afterCreate: async (union, options) => {
        const {
          chat: Chat,
          user_union: UserUnion,
          poll: Poll,
          pubkey: Pubkey
        } = sequelize.models;

        try {
          const transaction = options.transaction;

          if (!options.userId) {
            throw new Error("User ID not provided in afterCreate hook options");
          }

          const userId = options.userId;

          // Fetch admin pubkey
          const adminPubkey = await Pubkey.findOne({
            where: {
              userId
            },
          }, { transaction });
          if (!adminPubkey) {
            throw new Error("Admin public key not found");
          }
          const pubkeyValue = adminPubkey.dataValues.value;

          try {
            // Create general chats for the union
            await Chat.create({
              id: uuidv4(),
              name: `${union.name} general chat`,
              unionId: union.id,
              isDefault: true,
              isPublic: true,
            }, {
              transaction,
              userId,
              pubkeyValue
            });

            console.log(`General chat created for union: ${union.name}`);
          } catch (error) {
            console.error("there was an error creating the general chat for Union...", error)
          }

          try {
            // Create a default poll for the union
            await Poll.create({
              id: uuidv4(),
              name: `Poll for ${union.name}`,
              unionId: union.id,
              description: "Poll to unionize.",
              isActive: true,
              isDefault: true,
              workplaceId: null,
            }, {
              transaction
            });

            console.log(`Poll created for union: ${union.name}`);
          } catch (error) {
            console.error("There was an error creating default poll for Union", error)
          }
          try {
            // Associate the user with the union as admin
            await UserUnion.create({
              id: uuidv4(),
              userId,
              role: "admin",
              unionId: union.id,
            }, {
              transaction
            });

            console.log(`Admin user associated with union: ${union.name}`);
          } catch (error) {
            console.error("There was an error creating user Union (associating admin with union)", error)
          }


        } catch (error) {
          console.error("Error in Union afterCreate hook:", error);
          throw error;
        }
      },
    },
    sequelize,
    modelName: 'union',
    tableName: 'unions',
  });

  return union;
};