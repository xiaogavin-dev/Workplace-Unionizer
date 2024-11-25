const router = require('express').Router()
const { getChatInfo, getPublicKeys } = require('../controller/chatController')
router.route("/getChatInfo").get(getChatInfo)
router.route("/getPublicKeys").get(getPublicKeys)


module.exports = router