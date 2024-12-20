'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FormAnswer extends Model {
    static associate(models) {
      FormAnswer.belongsTo(models.formQuestion, {
        foreignKey: 'questionId',
        as: 'question',
      });

      FormAnswer.belongsTo(models.union, {
        foreignKey: 'unionId',
        as: 'union',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      FormAnswer.belongsTo(models.user, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }

  FormAnswer.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    unionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    questionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    answerText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    questionText: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'formAnswer',
    tableName: 'form_answers',
  });

  return FormAnswer;
};
