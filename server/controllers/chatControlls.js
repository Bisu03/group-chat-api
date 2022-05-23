
const Chat = require('../models/chatSchema')
const User = require('../models/userSchema')

const accessChat = async (req, res) => {
    const { userId } = req.body

    if (!userId) {
        console.log("userid not send");
        return res.status(401).json({ message: "userid not send" })
    }
    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    }).populate('users', "-password").populate("latestMessage")

    isChat = await User.populate(isChat, {
        path: "latestMessage",
        select: "name email profile"
    })

    if (isChat.length > 0) {
        res.send(isChat[0])
    } else {
        let ChatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user, userId]
        }

        try {
            const createChat = await Chat.create(ChatData)
            const FullChat = await findOne({ _id: createChat._id }).populate("users",
                "-password")
            res.send(FullChat)
            console.log(FullChat);
        } catch (error) {
            console.log(error);
            res.status(401).json({ message: "userid not send" })
        }
    }
}

const fetchChat = async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name pic email",
                });
                res.status(200).json(results);
            });
    } catch (error) {
        console.log(error);
        res.status(200).send("some thing went wrong");
    }
}

const createGroupChat = async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).json({ message: "Please Fill all the feilds" });
    }
    let users = JSON.parse(req.body.users);

    if (users.length < 2) {
        res.status(401).json({ message: "please add more than 2 people" })
    }
    users.push(req.user);
    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        console.log(error);
        res.status(200).send("some thing went wrong");
    }
}

const renameGroupe = async (req, res) => {
    const { chatId, chatName } = req.body

    try {


        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                chatName: chatName,
            },
            {
                new: true,
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        if (!updatedChat) {
            res.status(401).json({ message: "chat not found" })
        } else {
            res.json(updatedChat);
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "something went wrong" })
    }
}

const addGroup = async (req, res) => {
    const { chatId, userId } = req.body;

    try {


        const added = await Chat.findByIdAndUpdate(
            chatId,
            {
                $push: { users: userId },
            },
            {
                new: true,
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        if (!added) {
            res.status(401).json({ message: "chat not found" })
        } else {
            res.json(added);
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "something went wrong" })
    }
}

const removeGroup = async (req, res) => {
    const { chatId, userId } = req.body;

    try {


        const remove = await Chat.findByIdAndUpdate(
            chatId,
            {
                $pull: { users: userId },
            },
            {
                new: true,
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        if (!remove) {
            res.status(401).json({ message: "chat not found" })
        } else {
            res.json(remove);
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "something went wrong" })
    }
}

module.exports = {
    accessChat, fetchChat, createGroupChat, renameGroupe, addGroup, removeGroup
}

