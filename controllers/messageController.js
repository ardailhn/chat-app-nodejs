import asyncHandler from "express-async-handler";
import Message from "../models/Message.js";
import User from "../models/User.js";

export const getMessages = asyncHandler(async (req, res) => {
    const messages = await Message.find().populate('user', "username").lean();
    if (!messages?.length) {
        return res.status(400).json({ message: 'No messages found' });
    }
    res.json(messages);
});

export const postMessages = asyncHandler(async (req, res) => {
    const { message } = req.body
    const username = req.user;

    const user = await User.findOne({ username }).lean();
    
    if (!user || !message) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const newMessage = new Message({ user:user._id, message });

    const savedMessage = await newMessage.save();

    if (savedMessage) {
        global.io.emit('message', savedMessage);
        return res.status(201).json({ message: 'Message created' })
    } else {
        return res.status(400).json({ message: 'Invalid message data received' })
    }
});