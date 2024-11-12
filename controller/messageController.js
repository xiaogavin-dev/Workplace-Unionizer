const { message, user } = require('../models/index')
// const { v4: uuidv4 } = require('uuid')

const getChatMessages = async (req, res) => {
    const { chatId } = req.query
    try {
        const chatMessages = await message.findAll({
            where: {
                chatId
            },
            order: [['createdAt', 'DESC']],
            limit: 70,
        })
        const messages = []
        if (chatMessages[0]) {
            for (const message of chatMessages) {
                messages.push(message.dataValues)
            }
        }
        res.status(200).json({ message: "messages received successfully", data: messages })

    }
    catch (e) {
        console.log("there was an error retrieving messages: ", e)
    }
}

const createChatMessage = async (req, res) => {
    const { msg_details } = req.body
    console.log(msg_details)
    try {
        const createdMessage = await message.create({
            id: msg_details.id,
            content: msg_details.content,
            chatId: msg_details.chatId,
            userId: msg_details.userId,
            userDN: msg_details.userDN,
            createdAt: msg_details.createdAt,
            updatedAt: msg_details.updatedAt
        })


        console.log("message created: ", createdMessage.dataValues)
        res.status(200).json({ message: "Message created successfully", data: createdMessage.dataValues })
    } catch (error) {
        console.log("there was an error creating message: ", error)

    }
}
module.exports = { getChatMessages, createChatMessage }