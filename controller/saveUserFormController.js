const { formAnswer } = require('../models');

const storeAnswers = async (req, res) => {
  try {
    const { formAnswers } = req.body;

    if (!formAnswers || !Array.isArray(formAnswers)) {
      return res.status(400).json({ error: 'Invalid formAnswers format' });
    }

    console.log("FormAnswers received:", formAnswers); 

    const createdAnswers = await Promise.all(
      formAnswers.map(async (answer) => {
        const { questionId, unionId, userId, answer: answerText } = answer;

        if (!questionId || !unionId || !userId || !answerText) {
          throw new Error('All fields are required for each answer');
        }

        return await formAnswer.create({
          questionId,
          unionId,
          userId,
          answerText,
        });
      })
    );

    return res.status(201).json({ data: createdAnswers });
  } catch (error) {
    console.error('Error saving form answers:', error);
    return res.status(500).json({ error: 'Failed to save form answers' });
  }
};

module.exports = { storeAnswers };