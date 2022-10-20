const Trips = require("../models/Trips");
const catchAsync = require("../utils/errorsHandler/catchAsync");
const Wallet = require("../models/Wallet");
const { appError } = require("../utils/errorsHandler/errorsHandler");
const axios = require("axios");

exports.getTrips = catchAsync(async (req, res) => {
    const trips = await Trips.find({ user: req.user.id });

    return res.status(200).json({
        status: 'success',
        trips
    })
});

exports.createTrip = catchAsync(async (req, res) => {

    const tripData = ["pickup","destination","amountPaid","rideType"];
    const isNotOk = tripData.find(val => !req.body[val]);

    if(isNotOk) return appError(res, 400, "Incomplete parameters. State might have been lost due to page refresh or tampering");

    const response = await axios.get(`https://randomuser.me/api/`);
    const { results } = response.data;
    const driver = {
        name: results[0].name.first +" "+ results[0].name.last,
        driverName: results[0].name.first +" "+ results[0].name.last,
        gender: results[0].gender,
        age: results[0].dob.age,
        phoneNumber: results[0].phone,
        img: results[0].picture.large,
        code: results[0].login?.salt,
        rideCharge: Math.floor(Math.random() * 9000),
        rating: (Math.random() * 6).toFixed(2)
    };
    
    const newTripData = {};

    Object.keys(req.body).forEach(key => {
        if(tripData.includes(key)) newTripData[key] = req.body[key];
    });

    const newTrip = new Trips({
        ...newTripData,
        user: req.user.id,
        driverName: driver.driverName
    });

    await newTrip.save();

    driver._id = newTrip._id;
    let wallet = null;

    if(req.body.cardAmount) {
        wallet = await Wallet.findOneAndUpdate(
            { user: req.user.id }, { cardAmount: req.body.cardAmount }, { new: true }
        );
    }

    return res.status(200).json({
        status: 'success',
        message: 'Trip Booked Successfully. Enjoy Your Ride.',
        wallet,
        driver
    })
})

exports.removeTrip = catchAsync(async (req, res) => {
    if(!req.params.id) return appError(res, 400, "State was lost. You might have refreshed the page");
    
    await Trips.deleteOne({ _id: req.params.id });

    const num = Number(req.params.cost);
    let wallet = null;
    if(!isNaN(num)) {
        wallet = await Wallet.findOneAndUpdate(
            { user: req.user.id }, { cardAmount: Number(req.params.cost) }, { new: true }
        );
    }

    return res.status(200).json({
        status: 'success',
        message: 'Trip Removed Successfully.',
        wallet
    })
})