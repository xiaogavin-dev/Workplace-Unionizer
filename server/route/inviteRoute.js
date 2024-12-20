const express = require("express");
const { generateInviteLink} = require("../controller/inviteController");

const router = express.Router();

router.get("/generateInviteLink", generateInviteLink);

module.exports = router;
