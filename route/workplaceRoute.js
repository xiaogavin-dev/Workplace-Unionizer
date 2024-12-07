const {
  getWorkplaces,
  createWorkplace,
  deleteWorkplace,
} = require('../controller/workplaceController');

const router = require('express').Router();

router.get('/getWorkplaces', getWorkplaces);

router.post('/create', createWorkplace);

router.delete('/delete/:id', deleteWorkplace);

module.exports = router;
