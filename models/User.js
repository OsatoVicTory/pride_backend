const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        immutable: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
    },
    createdWithProvider: {
        type: String,
        default: "none",
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    img: {
        type: String,
        default: "",
    },
    role: {
        type: String,
        enum: ["rider","driver","admin"],
        default: "rider"
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);