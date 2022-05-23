const Chat = require('../models/chatSchema')
const User = require('../models/userSchema')
const Message = require('../models/messageSchema')

const sendMessage = async (req, res) => {
    const { content, chatId } = req.body

    if (!content || !chatId) {
        return res.status(401).json({ message: "invalid user data" })
    }

    let newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId

    }

    try {
        let message = await Message.create(newMessage)
        message = await message.populate("sender", "name pic")
        message = await message.populate("chat")
        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email"
        })

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message
        })

        res.json(message)

    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "invalid user data" })
    }
}

const allMessage = async (req, res) => {
    try {
        const message = await Message.find({ chat: req.params.chatId }).populate("sender", "name pic email").populate("chat")
        res.json(message)
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "invalid user data" })
    }
}

module.exports = {
    sendMessage, allMessage
}