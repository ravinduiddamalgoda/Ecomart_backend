const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role : {
        type: String,
        enum: ['seller', 'buyer'],
        required: true
    },
    lastLogin : {
        type: String,
        required: true,
        default: "-1"
    },
    firstLogin : {
        type: Boolean,
        required: true,
        default: true
    },
    otp : {
        type: String,
        required: true,
        default: "-1"
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;