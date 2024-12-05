const { message, user, encryptedKey, pubkey } = require('../models/index')
// const { v4: uuidv4 } = require('uuid')

const getChatMessages = async (req, res) => {
    //IMPORTANT -> I NEED TO ADD THE USERID SO I CAN GRAB ONLY THE KEYS ENCRYPTED KEYS THAT BELONG TO THIS SPECIFIC USER. 
    // RIGHT NOW I AM GRABBING THE ENCRYPTED KEY FOR THE USER THAT CREATED TEHE CHATS WHICH CAUSES AN ERROR
    const { chatId, userId } = req.query
    try {
        const chatMessages = await message.findAll({
            where: {
                chatId
            },
            include: [
                {
                    model: user,
                    include: [
                        {
                            model: pubkey
                        },
                    ],
                    attributes: ['displayName']
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: 30,
        })
        const userPubkeyValue = await pubkey.findOne({
            where: {
                userId
            }
        })
        const messages = []
        const keys = []
        let prevKeyVersion = null
        if (chatMessages[0]) {
            for (const message of chatMessages) {
                if (message.keyVersionId == prevKeyVersion) {
                    messages.push({
                        id: message.dataValues.id,
                        content: message.dataValues.content,
                        userId: message.dataValues.userId,
                        userDn: message.dataValues.displayName,
                        chatId: message.dataValues.chatId,
                        createdAt: message.dataValues.createdAt,
                        updatedAt: message.dataValues.updatedAt,
                        keyVersionId: message.dataValues.keyVersionId,
                    })
                }
                else {
                    // 
                    const encryptedSymmetricKey = await encryptedKey.findOne({
                        where: {
                            versionId: message.keyVersionId,
                            pubkeyValue: userPubkeyValue.value// THIS SHOULD BE THE PUBKEY VALUE FOR THE USERID THAT IS PASSED IN
                        }
                    })
                    // when this encryptedSymmetricKey is null, it means that there is no value encrpted key for this user for this message
                    // in this case the user shouldn't receive this message at all
                    if (encryptedSymmetricKey) {
                        messages.push({
                            id: message.dataValues.id,
                            content: message.dataValues.content,
                            userId: message.dataValues.userId,
                            userDn: message.dataValues.displayName,
                            chatId: message.dataValues.chatId,
                            createdAt: message.dataValues.createdAt,
                            updatedAt: message.dataValues.updatedAt,
                            keyVersionId: message.dataValues.keyVersionId,
                        })
                        keys.push(encryptedSymmetricKey)
                        prevKeyVersion = message.keyVersionId
                    }


                }
            }
        }
        res.status(200).json({ message: "messages received successfully", data: { messages, keys } })

    }
    catch (e) {
        console.log("there was an error retrieving messages: ", e)
    }
}

const createChatMessage = async (req, res) => {
    const { msg_details } = req.body
    try {
        const createdMessage = await message.create({
            id: msg_details.id,
            content: msg_details.content,
            chatId: msg_details.chatId,
            userId: msg_details.userId,
            createdAt: msg_details.createdAt,
            updatedAt: msg_details.updatedAt,
            keyVersionId: msg_details.keyVersionId
        })


        res.status(200).json({ message: "Message created successfully", data: createdMessage.dataValues })
    } catch (error) {
        console.log("there was an error creating message: ", error)

    }
}
module.exports = { getChatMessages, createChatMessage }