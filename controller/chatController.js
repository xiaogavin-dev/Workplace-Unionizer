const { chat, user_chat } = require("../models/index")

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

const getPublicKeys = async (req, res) => {
    const {
        chatId,
    } = req.query
    const user_chat_map = await user_chat.findAll({
        where: {
            chatId
        }
    })
    const publicKeys = []
    for (const user_chat_instance of user_chat_map) {
        publicKeys.push(user_chat_instance.dataValues.pubkeyValue)
    }
    console.log(publicKeys)
    res.status(200).json({ message: "Chat info Received", data: publicKeys })

}

const storeEncryptedKey = async (req, res) => {
    const {
        encryptedKeys
    } = req.body

}
module.exports = { getChatInfo, getPublicKeys }