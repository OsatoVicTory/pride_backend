const express = require("express");
const { authUser } = require("../middlewares/authMiddleWares/authMiddleWare");
const controller = require("../controller/walletController");

const router = express.Router();

router.get("/", authUser, controller.getWallet);

router.post("/", authUser, controller.createWallet);

module.exports = router;