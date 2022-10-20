const { sendMailEngine } = require("./mailsController");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { appError } = require("../utils/errorsHandler/errorsHandler");
const catchAsync = require("../utils/errorsHandler/catchAsync");
const { sendCookie } = require("./sendCookie");
const jwt = require("jsonwebtoken");
require("dotenv").config();


exports.resetPassword = catchAsync(async (req, res) => {

    const { oldPassword, password } = req.body;

    const user = await User.findById(req.user.id);

    const correctPassword = await bcrypt.compare(oldPassword, user.password);

    if(!correctPassword) {
        return appError(res, 400, "Old Password does not Match previous Password");
    }

    const newPassword = await bcrypt.hash(password, 10);

    if(user.createdWithProvider !== "none") {
        return res.status(200).json({
            status: 'success',
            message: `You cannnot reset password as you created this account with your ${user.createdWithProvider} account`
        });
    }

    const newUserData = await User.findByIdAndUpdate(
        { _id: req.user.id }, { password: newPassword }, { new: true }
    );

    res.status(200).json({
        status: 'success',
        message: 'Password Reset Confirmed', 
        user: newUserData
    });
});