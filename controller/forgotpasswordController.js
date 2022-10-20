const { sendMailEngine } = require("./mailsController");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const catchAsync = require("../utils/errorsHandler/catchAsync");
const { appError } = require("../utils/errorsHandler/errorsHandler");
const jwt = require("jsonwebtoken");
require("dotenv").config();


exports.forgotPassword = catchAsync(async (req, res) => {

    const { email, password } = req.body;

    const isUser = await User.findOne({ email });

    if(!isUser) return res.status(400).json({
        status: 'failed',
        message: 'Invalid User. Provide Correct Email'
    })

    const newPassword = await bcrypt.hash(password, 10);

    const tokenData = {
        id: isUser._id.toString(),
        password: newPassword,
    }

    const token = await jwt.sign(tokenData, process.env.MYSECRET);

    res.status(200).json({
        status: 'success',
        message: 'Redirecting to Verification Link',
        token
    });

});


exports.forgotPasswordUpdate = catchAsync(async (req, res) => {

    const decodedToken = await jwt.verify(req.params.token, process.env.MYSECRET);

    const newData = await User.findByIdAndUpdate(
        { _id: decodedToken.id },
        { password: decodedToken.password }, { new: true }
    );

    res.status(200).json({
        status: 'success',
        message: 'Password Updated. Redirecting to Log In'
    })

});