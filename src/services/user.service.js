const User = require('../models/User');
const { signToken } = require('./auth.service');
const { validate } = require('../utils/validator');
const { createPasswordHash } = require('./auth.service');
const { verifyToken } = require('./auth.service');
const { validatePassword } = require('./auth.service');

const getUsers = async () => {
    try {
        const users = await User.find({}, { password: 0 });
        return users;
    } catch (error) {
        throw new Error(error);
    }
};

const getUserById = async (id) => {
    try {
        const user = await User.findById(id);
        return user;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};

const createUser = async (firstName, lastName, email, password, role) => {
    try {
        const hashedPassword = await createPasswordHash(password);
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
        });
        await newUser.save();
        newUser.password = "";
        return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};

const updateUser = async (userid, firstName, lastName, email, password, role, lastLogin, firstLogin, otp) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userid,
            { firstName, lastName, email, password, role, lastLogin, firstLogin, otp },
            { new: true }
        );
        return updatedUser;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};

const deleteUser = async (id) => {
    try {
        await User.findByIdAndDelete(id);
    } catch (error) {
        throw new Error(error);
    }
};

const getUserByEmail = async (email) => {
    try {
        const user = await User.findOne({ email });
        return user;
    } catch (error) {
        throw new Error(error);
    }
};

const loginUser = async (email, password) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }
        const isValidPassword = await validatePassword(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid Password');
        }
        return "login-done";
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    loginUser,
    getUserByEmail,
};
