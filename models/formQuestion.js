'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FormQuestion extends Model {
    static associate(models) {
      FormQuestion.belongsTo(models.union, {
        foreignKey: 'unionId',
        as: 'union',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  FormQuestion.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    questionText: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'formQuestion',
    tableName: 'form_questions',
  });

  return FormQuestion;
};
