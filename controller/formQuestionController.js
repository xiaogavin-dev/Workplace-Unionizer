const { formQuestion } = require('../models');

const saveFormQuestions = async (req, res) => {
  try {
    const { unionId, questions } = req.body;

    if (!unionId || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    // Prepare question data
    const questionData = questions.map((questionText) => ({
      unionId,
      questionText,
    }));

    // Save questions in bulk
    const createdQuestions = await formQuestion.bulkCreate(questionData);

    return res.status(201).json({
      status: 'success',
      data: createdQuestions,
    });
  } catch (error) {
    console.error('Error saving form questions:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to save form questions',
    });
  }
};

module.exports = { saveFormQuestions };
