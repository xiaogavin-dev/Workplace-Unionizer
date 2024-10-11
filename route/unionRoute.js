const { getUnions } = require('../controller/unionController')

const router = require('express').Router()

router.route('/getUnions').get(getUnions)

module.exports = router