const { verifyUser } = require('../controller/userController')

const router = require('express').Router()

router.route('/verify-token').post(verifyUser)

module.exports = router