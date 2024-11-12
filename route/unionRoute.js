const { getUnions, getUserUnions, joinUnion } = require('../controller/unionController')
const { getUnionById } = require('../controller/unionIdController')
const { createUnion } = require('../controller/createUnionController');

const router = require('express').Router()

router.route('/getUnions').get(getUnions)

router.route('/getUnion/:id').get(getUnionById);

router.route('/getUserUnions').get(getUserUnions)

router.route('/joinUnion').post(joinUnion)

router.post('/create', createUnion);

module.exports = router