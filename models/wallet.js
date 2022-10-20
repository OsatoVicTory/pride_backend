const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        immutable: true
    },
    cardType: {
        type: String,
        default: "Visa"
    },
    cardName: {
        type: String,
        required: true,
    },
    cardNumber: {
        type: Number,
        required: true
    },
    cardCvc: {
        type: Number,
        required: true,
    },
    cardExpiry: {
        type: Number,
        required: true
    },
    cardAmount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Wallet', walletSchema);