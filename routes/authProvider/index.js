const express = require("express");
const google = require("./googleAuthProvider");
const linkedin = require("./linkedInAuthProvider");
const router = express.Router();

router.use("/google", google);
router.use("/LinkedIn", linkedin);

module.exports = router;