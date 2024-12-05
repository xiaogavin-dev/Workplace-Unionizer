const express = require('express');
const { saveFormQuestions } = require('../controller/formQuestionController');
const { getFormQuestions } = require('../controller/getFormQuestionController');
const { storeAnswers } = require('../controller/saveUserFormController');
const router = express.Router();

router.post('/questions', saveFormQuestions);
router.get('/questions/:unionId', getFormQuestions);
router.post('/answers', storeAnswers );
module.exports = router;