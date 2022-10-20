const express = require("express");
const { appError } = require("../utils/errorsHandler/errorsHandler");
require('dotenv').config();
const cloudinary = require("cloudinary").v2;

const { CLOUDINARY_CLOUDNAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET } = process.env;
cloudinary.config({
    cloud_name: CLOUDINARY_CLOUDNAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_SECRET,
})

const router = express.Router();

router.get("/", (req, res) => {
    try {
        const date = new Date();
        const timestamp = Math.round((date.getTime())/1000);
        
        const params = {
            timestamp: timestamp
        };
        const signature = cloudinary.utils.api_sign_request(params, CLOUDINARY_SECRET);
        // console.log(signature);
        
        return res.status(200).json({
            status: 'success',
            data: { 
                timestamp, 
                signature, 
                apiKey: CLOUDINARY_API_KEY, 
                cloudName: CLOUDINARY_CLOUDNAME 
            }
        });

    } catch (err) {
        return appError(res, 500, "Sorry. Something Went Wrong");
    }
});

module.exports = router;