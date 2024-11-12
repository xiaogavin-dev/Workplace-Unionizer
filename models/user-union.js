'use strict';
const { Model } = require('sequelize');

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
        sequelize,
        modelName: 'user_union',
        tableName: 'user_unions',
        timestamps: true,  // Include createdAt and updatedAt fields
    });

    return userUnion;
};
