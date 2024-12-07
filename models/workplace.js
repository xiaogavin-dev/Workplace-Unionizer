'use strict';
const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid')
module.exports = (sequelize, DataTypes) => {
  class Workplace extends Model {
    static associate(models) {
      Workplace.belongsTo(models.union, {
        foreignKey: 'unionId',
        as: 'union',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Workplace.belongsToMany(models.user, {
        through: 'user_workplace',
        foreignKey: 'workplaceId',
        otherKey: 'userId'
      });
      Workplace.hasMany(models.chat, {
        foreignKey: 'workplaceId'
      })
    }
  }

  Workplace.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    workplaceName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    organization: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    street: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    addressLine2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    zip: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    unionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    isUnionized: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    employeeCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    hooks: {
      afterCreate: async (Workplace, options) => {
        const { chat, poll, pubkey } = sequelize.models;
        const userId = options.userId
        const transaction = options.transaction
        try {
          const adminPubkey = await pubkey.findOne({ where: { userId } }, { transaction });
          if (!adminPubkey) {
            throw new Error("Admin public key not found");
          }

          const pubkeyValue = adminPubkey.dataValues.value;
          const workplaceId = Workplace.id
          try {
            const newWorkplaceChat = await chat.create({
              id: uuidv4(),
              name: Workplace.workplaceName + ' general chat',
              unionId: options.unionId,
              chatKeyVersion: null,
              workplaceId,
              isDefault: true,
              isPublic: false
            }, { transaction, userId, pubkeyValue })

          } catch (error) {
            console.error("There was an error creating general chat in workplace.js... ", error)
          } try {
            const newAnouncementChat = await chat.create({
              id: uuidv4(),
              name: "Anouncements",
              unionId: options.unionId,
              chatKeyVersion: null,
              workplaceId,
              isDefault: true,
              isPublic: false
            }, { transaction, userId, pubkeyValue })

          } catch (error) {
            console.error("There was an error creating announcement chat in workplace.js... ", error)
          }
          try {
            const newWorkplacePoll = await poll.create({
              id: uuidv4(),
              name: `Poll for ${Workplace.workplaceName}`,
              unionId: options.unionId,
              description: "Poll to unionize.",
              isActive: true,
              isDefault: true,
              workplaceId: workplaceId,
            }, { transaction, });
          } catch (error) {
            console.error("There was an error when creating default poll for workplace. Check workplace.js...", error)
          }
        } catch (error) {
          console.error("There was an error in creating workplaces. Check workplace.js", error)

        }
      }
    },
    sequelize,
    modelName: 'workplace',
  });

  return Workplace;
};
