const generateInviteLink = (req, res) => {
    const { unionId } = req.query;

    if (!unionId) {
        return res.status(400).json({ message: "Union ID is required" });
    }

    const inviteLink = `http://localhost:3000/joinunion/${unionId}`;
    return res.status(200).json({ link: inviteLink });
};

module.exports = {
    generateInviteLink,
};
