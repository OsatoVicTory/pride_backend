const mongoose = require('mongoose');

const tripsSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        immutable: true
    },
    driverName: {
        type: String,
        required: true,
    },
    pickup: {
        type: String,
        required: true,
        immutable: true
    },
    destination: {
        type: String,
        required: true,
        immutable: true
    },
    amountPaid: {
        type: Number,
        required: true,
    },
    rideType: {
        type: String,
        enum: ["ride","courier","hotel"],
        default: "ride"
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Trips', tripsSchema);