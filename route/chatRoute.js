const router = require('express').Router()
const { getChatInfo, getPublicKeys, storeEncryptedKeys, getEncryptedKey } = require('../controller/chatController')
router.route("/getChatInfo").get(getChatInfo)
router.route("/getPublicKeys").get(getPublicKeys)
router.route("/storeEncryptedKeys").post(storeEncryptedKeys)
router.route("/getEncryptedKey").get(getEncryptedKey)


module.exports = router