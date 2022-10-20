const express = require("express");
const { authUser } = require("../middlewares/authMiddleWares/authMiddleWare");
const controller = require("../controller/tripsController");

const router = express.Router();

router.get("/", authUser, controller.getTrips);

router.post("/", authUser, controller.createTrip);

router.get("/:id/:cost", authUser, controller.removeTrip);

module.exports = router;