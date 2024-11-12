const router = require('express').Router()
const { getChatInfo } = require('../controller/chatController')
router.route("/getChatInfo").get(getChatInfo)


module.exports = router