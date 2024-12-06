const {
  getWorkplaces,
  getWorkplacesByUnionId,
  createWorkplace,
  deleteWorkplace,
} = require('../controller/workplaceController');

const router = require('express').Router();

router.get('/getWorkplaces', getWorkplacesByUnionId);

router.post('/create', createWorkplace);

router.delete('/delete/:id', deleteWorkplace);

module.exports = router;
