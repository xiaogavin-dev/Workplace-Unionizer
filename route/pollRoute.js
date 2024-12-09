const express = require('express');
const router = express.Router();
const { getPollsByUnionId, getPollsByWorkplaceId, handleVote, getVotes } = require('../controller/pollController'); 

router.get('/', getPollsByUnionId);
router.get('/workplace', getPollsByWorkplaceId);


router.post('/vote', handleVote);
router.get('/votes', getVotes); // Route to get current votes

module.exports = router;