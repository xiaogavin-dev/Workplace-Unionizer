const express = require('express');
const { searchUnions } = require('../controller/searchController');

const router = express.Router();

router.get('/search', searchUnions);

module.exports = router;
