// const Users = require("../models/Users");
const catchAsync = require("../utils/errorsHandler/catchAsync");
const { v4: uuidv4 } = require("uuid")
require("dotenv").config();

exports.getMapToken = catchAsync(async (req, res) => {

    if(req.params.role !== "admin") {
        return res.status(200).json({
            status: "failed",
            message: "Only Admin Can Use Map Services Because It is Not Free"
        })
    }

    const SESSION_TOKEN = uuidv4();
    res.status(200).json({
        status: "success",
        SESSION_TOKEN,
        ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN
    })
});