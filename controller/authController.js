const { appError } = require("../utils/errorsHandler/errorsHandler");
const catchAsync = require("../utils/errorsHandler/catchAsync");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { sendAccountVerificationMail } = require("./mailsController");
const { sendCookie } = require("./sendCookie");
require("dotenv").config();


exports.logInUser = catchAsync(async (req, res) => {
    
    const { email, password } = req.body;
    const user = await User.findOne({ email });


    if(!user) return appError(res, 500, "Invalid Email address");

    const validPassword = await bcrypt.compare(password, user.password);

    if(!validPassword) return appError(res, 500, "Invalid Password");

    const tokenData = { id: user._doc._id.toString() };

    const token = await jwt.sign(tokenData, process.env.MYSECRET);

    if(!user.isVerified) {

        return res.status(200).json({
            status: 'failed',
            message: "User Not Verified. Redirecting to Verification Page",
            token
        })
    }

    sendCookie(res, token);
    return res.status(200).json({
        status: 'success',
        message: "Logged In Successfully",
        user: {
            ...user._doc,
            RAPID_API_KEY: process.env.RAPID_API_KEY
        }
    })
});

exports.signUpUser = catchAsync(async (req, res, next) => {

    const { email, password } = req.body;

    const userExist = await User.findOne({ email });
    
    if(userExist) return appError(res, 400, "User Already Exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
        ...req.body,
        password: hashedPassword,
        isVerified: false
    }
    const newUser = new User(userData);

    const tokenData = { id: newUser._id.toString() };
    const token = jwt.sign(tokenData, process.env.MYSECRET);

    await newUser.save();

    res.status(200).json({
        status: 'success',
        message: 'User Created. Redirecting to Verification Page',
        token
    });

});

exports.verifyAccount = catchAsync(async (req, res) => {

    const decodedToken = await jwt.verify(req.params.token, process.env.MYSECRET);

    await User.findByIdAndUpdate(decodedToken.id, {
        isVerified: true
    });

    res.status(200).json({
        status: 'success',
        message: 'Account Verified Successfully. Redirecting to Log in'
    })

});


exports.updateUser = catchAsync(async (req, res) => {

    //filter out password
    const data = {};
    ["firstName","lastName","email","phoneNumber","img"].forEach(key => {
        data[key] = req.body[key]
    });
    
    const newUser = await User.findByIdAndUpdate(
        { _id: req.user.id }, data, { new: true }
    );

    res.status(200).json({
        status: 'success',
        message: 'Profile Updated Successfully',
        user: newUser
    })
});

exports.userLoggedIn = catchAsync(async (req, res) => {
    const user = await User.findById(req.user.id);

    const userData = {
        ...user._doc,
        id: user._doc._id.toString(),
        RAPID_API_KEY: process.env.RAPID_API_KEY
    }

    res.status(200).json({
        status: 'success',
        message: `Welcome Back ${user.firstName}`,
        user: userData
    })
});

exports.logOutUser = catchAsync(async (req, res) => {

    res.clearCookie("PRIDE_TOKEN");
    return res.status(200).json({
        status: 'success',
        message: 'Logged Out Successfully'
    });
});