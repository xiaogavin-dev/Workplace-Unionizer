const express = require('express');
const { saveFormQuestions } = require('../controller/formQuestionController');
const { getFormQuestions } = require('../controller/getFormQuestionController');
const { storeAnswer } = require('../controller/saveUserFormController');
const router = express.Router();

router.post('/questions', saveFormQuestions);
router.get('/questions/:unionId', getFormQuestions);
router.post('/answers', storeAnswer );
module.exports = router;