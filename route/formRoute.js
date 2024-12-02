const express = require('express');
const { saveFormQuestions } = require('../controller/formQuestionController');
const { getFormQuestions } = require('../controller/getFormQuestionController');
const router = express.Router();

router.post('/questions', saveFormQuestions);
router.get('/questions/:unionId', getFormQuestions);
module.exports = router;