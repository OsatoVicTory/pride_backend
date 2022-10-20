const express = require("express");
const router = express.Router();
const { authUser } = require("../middlewares/authMiddleWares/authMiddleWare");
const authController = require("../controller/authController");
const forgotpasswordController = require("../controller/forgotpasswordController");
const passwordresetController = require("../controller/resetpasswordController");
// const mailServices = require("../controller/mailsController");

//if user tries to log in but has not been verified by mail
//send verification mail to user, else we would have returned from the functions call;
router.post("/login", authController.logInUser);

router.post("/signup", authController.signUpUser);

router.get("/verify-account/:token", authController.verifyAccount);

router.get("/user-logged-in", authUser, authController.userLoggedIn);

router.post("/forgot-password", forgotpasswordController.forgotPassword);

router.get("/forgot-password-update/:token", forgotpasswordController.forgotPasswordUpdate);

//user is logged in but want to change his password
//dont remove authUser
router.post("/reset-password", authUser, passwordresetController.resetPassword);

router.post("/update", authUser, authController.updateUser);

router.get("/logout", authController.logOutUser);

module.exports = router;