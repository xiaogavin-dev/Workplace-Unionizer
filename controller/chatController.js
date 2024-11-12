const { chat } = require("../models/index")

const getChatInfo = async (req, res) => {
    const {
        chatId,
    } = req.query
    try {
        const chatInfo = await chat.findAll({
            where: {
                id: chatId
            }
        })
        res.status(200).json({ message: "Chat info Received", data: chatInfo[0].dataValues })
    } catch (error) {
        console.log("There was an error getting chat information", error)

    }
}
module.exports = { getChatInfo }