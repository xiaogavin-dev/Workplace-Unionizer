const router = require('express').Router()
const { getChatMessages, createChatMessage } = require('../controller/messageController')

router.route("/getChatMessages").get(getChatMessages)
router.route("/createChatMessage").post(createChatMessage)
module.exports = router