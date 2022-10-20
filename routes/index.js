const express = require("express");

const router = express.Router();

const authRoute = require("./authRoutes");
const providerAuthRoute = require("./authProvider/index");
const tripsRoute = require("./tripsRoute");
const walletRoute = require("./walletRoute");
const cloudinaryRoute = require("./cloudinaryRoute");
const mapRoute = require("./mapRoute");

router.use("/user", authRoute);
router.use("/trips", tripsRoute);
router.use("/wallet", walletRoute);
router.use("/cloudinary", cloudinaryRoute);
router.use("/auth", providerAuthRoute);
router.use("/map", mapRoute);


module.exports = router;