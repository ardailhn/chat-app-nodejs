import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import bcrypt from 'bcrypt';

// @desc Get all users
// @route GET /users
// @access Private
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean();
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' });
    }
    res.json(users);
});

// @desc Create new user
// @route POST /users
// @access Private
export const createNewUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const roles = ['user'];

    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const duplicate = await User.findOne({ username }).lean().exec();
    if (duplicate) {
        return res.status(400).json({ message: 'Duplicate username' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userObject = { username, "password": hashedPassword, roles }

    const user = await User.create(userObject);

    if (user) {
        res.status(201).json({ message: `New user ${username} created` });
    } else {
        res.status(400).json({ message: 'Somethings went wrong!' });
    }
});

// @desc UPDATE a user
// @route PATCH /users
// @access Private
export const updateUser = asyncHandler(async (req, res) => {
    const { id, username, roles, active, password } = req.body;

    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    const duplicate = await User.findOne({ username }).lean().exec();
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(400).json({ message: 'Duplicate username' });
    }

    user.username = username;
    user.roles = roles;
    user.active = active;

    if (password) {
        user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();

    res.json({ message: `${updatedUser.username} updated` });
});