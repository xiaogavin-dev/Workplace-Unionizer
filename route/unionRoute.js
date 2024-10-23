const { getUnions } = require('../controller/unionController')
const { getUnionById } = require('../controller/unionIdController')

const router = require('express').Router()

router.route('/getUnions').get(getUnions)

router.route('/getUnion/:id').get(getUnionById);

module.exports = router