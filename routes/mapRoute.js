const express = require("express");
const { authUser } = require("../middlewares/authMiddleWares/authMiddleWare");
const controller = require("../controller/mapController");

const router = express.Router();

router.get("/:role", authUser, controller.getMapToken);

module.exports = router;