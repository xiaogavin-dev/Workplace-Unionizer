const { chat, user_chat, keyVersion, pubkey, encryptedKey } = require("../models/index")
const { v4: uuidv4 } = require('uuid')
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
    console.log(chatId)
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

const storeEncryptedKeys = async (req, res) => {
    const {
        chatId,
        encryptedKeys
    } = req.body
    console.log("1_________________________________________________________________________________")
    try {
        const chatInfo = await chat.findOne({
            where: {
                id: chatId
            },
            include: {
                model: keyVersion,
                attributes: ['vCount']
            }
        })
        //first we have to create a new keyVersion for this new symmetric key
        console.log("2_________________________________________________________________________________")
        const newKeyVersionValue = chatInfo.keyVersion ? chatInfo.keyVersion + 1 : 1
        // create keyVersion
        const newKeyVersion = await keyVersion.create({
            id: uuidv4(),
            vCount: newKeyVersionValue,
            chatId
        }, { encryptedKeys, chatId })
        console.log(newKeyVersion)
        //we also need to update the current keyVersion for the specific chat
        const [numRowsUpdated] = await chat.update(
            { chatKeyVersion: newKeyVersion.id, },
            { where: { id: chatId } }
        )
        console.log(`THERE WERE ${numRowsUpdated} rows updated`)
        const updatedRow = await chat.findOne({
            where: {
                id: chatId
            }
        })

        res.json({ message: 'keys were stored properly, here is updated chat information', data: updatedRow })
    } catch (error) {
        console.log(error)
    }
}

//we're going to allow user to fetch the encryptedSymmetricKey meant for them
const getEncryptedKey = async (req, res) => {
    const { userId, chatKeyVersion } = req.query
    try {
        const userPubkeyRow = await pubkey.findOne({
            where: {
                userId
            }
        })
        console.log("THIS IS USER PUBKEY LINE 92: ", chatKeyVersion)
        //now we have pubkey for the user, we will get the encrypted message for the specific, chat
        const encryptedKeyRow = await encryptedKey.findOne({
            where: {
                pubkeyValue: userPubkeyRow.dataValues.value,
                versionId: chatKeyVersion
            }
        })
        res.status(200).json({ message: 'encrypted key found', data: encryptedKeyRow })
    } catch (error) {
        console.log('There was an error trying to receive the encrypted key', error)
        res.status(404).json({ message: 'encrypted key not found', data: error })

    }

}
module.exports = { getChatInfo, getPublicKeys, storeEncryptedKeys, getEncryptedKey }