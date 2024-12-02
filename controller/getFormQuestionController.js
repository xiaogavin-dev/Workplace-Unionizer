const { formQuestion } = require('../models');

const getFormQuestions = async (req, res) => {
  try {
    const { unionId } = req.params;

    if (!unionId) {
      return res.status(400).json({ message: 'Union ID is required' });
    }

    const questions = await formQuestion.findAll({
      where: { unionId },
      attributes: ['id', 'questionText'],
    });

    if (!questions || questions.length === 0) {
      return res.status(404).json({ message: 'No questions found for this union' });
    }

    return res.status(200).json({
      status: 'success',
      data: questions,
    });
  } catch (error) {
    console.error('Error fetching form questions:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch form questions',
    });
  }
};

module.exports = { getFormQuestions };
