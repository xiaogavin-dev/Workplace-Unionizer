'use strict';
const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid')
module.exports = (sequelize, DataTypes) => {
    class userUnion extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define associations here
            userUnion.belongsTo(models.user, {
                foreignKey: 'userId',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });
            userUnion.belongsTo(models.union, {
                foreignKey: 'unionId',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });
        }
    }

    userUnion.init({
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('admin', 'general'),
            defaultValue: 'general',
        },
        unionId: {
            type: DataTypes.UUID,
            allowNull: false,
        },

    }, {
        hooks: {
            afterCreate: async (user_union, options) => {
                const { chat, user_chat, pubkey } = sequelize.models
                try {
                    if (!user_union.unionId) { throw new Error("unionId is missing") }
                    const publicChatInstances = await chat.findAll({
                        where: {
                            unionId: user_union.unionId,
                            isPublic: true
                        },
                    })
                    const userPubkey = await pubkey.findOne({
                        where: {
                            userId: user_union.userId
                        }
                    })
                    for (const publicChat of publicChatInstances) {
                        if (!publicChat.dataValues.id) {
                            console.log("NOT GRABBING chatId PROPERLY: ", publicChat.dataValues);
                            continue; // Skip this chat
                        }

                        if (!userPubkey.dataValues.value) {
                            console.log("NOT GRABBING pubkey PROPERLY: ", userPubkey)
                            console.log("No users found for chat:", publicChat.dataValues.chatId);
                            continue; // Skip this chat
                        }

                        try {
                            const newUserChat = await user_chat.create({
                                id: uuidv4(),
                                chatId: publicChat.dataValues.id,
                                userId: user_union.userId,
                                pubkeyValue: userPubkey.value,
                                role: 'general',
                            });

                            console.log(
                                `User chat instance created for user: ${user_union.userId}`,
                            );
                        } catch (error) {
                            console.error(
                                `Error creating user chat for user: ${user_union.userId} in chat: ${publicChat.dataValues.chatId}`,
                                error
                            );
                        }
                    }
                } catch (error) {
                    console.log('There wwas an error creating user chat instance', error)
                }

            }
        },
        sequelize,
        modelName: 'user_union',
        tableName: 'user_unions',
        timestamps: true,  // Include createdAt and updatedAt fields
    });

    return userUnion;
};
