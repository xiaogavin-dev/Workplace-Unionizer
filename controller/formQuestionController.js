const { formQuestion } = require('../models');

const saveFormQuestions = async (req, res) => {
  try {
    const { unionId, questions } = req.body;

    if (!unionId || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    // Delete all existing questions only if questions are provided
    if (questions.length > 0) {
      await formQuestion.destroy({
        where: { unionId },
      });

      // Insert the new set of questions
      const newQuestions = questions.map((questionText) => ({
        unionId,
        questionText: questionText.questionText,
      }));

      const savedQuestions = await formQuestion.bulkCreate(newQuestions);

      return res.status(200).json({
        status: "success",
        data: savedQuestions,
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "No questions provided to save.",
      });
    }
  } catch (error) {
    console.error("Error saving form questions:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to save form questions",
    });
  }
};

module.exports = { saveFormQuestions };
