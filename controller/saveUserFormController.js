const { FormAnswer } = require('../models');

const storeAnswer = async (req, res) => {
    try {
      const { questionId, unionId, answer } = req.body;
  
      if (!questionId || !unionId || !answer) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      const formAnswer = await FormAnswer.create({ questionId, unionId, answer });
  
      return res.status(201).json(formAnswer);
    } catch (error) {
      console.error('Error saving form answer:', error);
      return res.status(500).json({ error: 'Failed to save form answer' });
    }
  };
  
  module.exports = { storeAnswer };