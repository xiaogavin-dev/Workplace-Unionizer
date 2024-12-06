const { v4: uuidv4 } = require("uuid");

const generateInviteLink = (req, res) => {
    console.log("Request received on /api/invites/generateInviteLink");
    const { unionId } = req.query;
    console.log("Union ID:", unionId);

    if (!unionId) {
        return res.status(400).json({ message: "Union ID is required" });
    }

    const inviteLink = `http://localhost:3000/joinunion/${unionId}`;
    return res.status(200).json({ link: inviteLink });
};


module.exports = {
  generateInviteLink,
};
