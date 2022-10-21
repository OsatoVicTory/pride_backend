const express = require("express");
const passport = require("passport");
const router = express.Router();
const session = require("express-session");
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const User = require("../../models/User");
const { sendCookie } = require("../../controller/sendCookie");
const jwt = require("jsonwebtoken");
// const { sendMailEngine } = require("../../controller/mailsController");
require('dotenv').config();

router.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: {
        name: "PRIDE_TOKEN",
        httpOnly: true,
        maxAge: Date.now() + 86400000,
        sameSite: 'none',
        secure: false
    }
}));


router.use(passport.initialize());
router.use(passport.session());
router.use(express.json());

passport.use(new LinkedInStrategy({
    clientID: process.env.LINKED_APP_ID,
    clientSecret: process.env.LINKED_SECRET,
    callbackURL: process.env.LINKED_CALLBACK_URL,
    scope: ['r_emailaddress', 'r_liteprofile'],
    state: true
}, async (accessToken, refreshToken, profile, cb) => {
    try {
        const { emails, name, id } = profile;
        const email = emails[0].value;
        const user = await User.findOne({ email });
        if(user) {
            return cb(null, user._doc);
        }
        const userAccount = new User({
            email,
            password: id,
            firstName: name.givenName,
            lastName: name.familyName,
            createdWithProvider: "linkedIn",
            isVerified: true
        });
        
        await userAccount.save();

        return cb(null, userAccount);
    } catch (err) {
        return cb(err);
    }
}));


passport.serializeUser(function (user, cb) {
    cb(null, user);
});
passport.deserializeUser(function (user, cb) {
    cb(null, user);
})

router.get("/success", async (req, res) => {
    const token = await jwt.sign({ id: req.user._id.toString() }, process.env.MYSECRET);
    sendCookie(res, token);
    res.clearCookie("connect.sid");
    res.redirect(`${process.env.FRONTEND_URL}/app/rides`);
})

router.get("/fail", function(req, res) {
    res.redirect(`${process.env.FRONTEND_URL}/login`);
})

router.get("/", 
  passport.authenticate("linkedin"),
  function(req, res) {

  }
);

router.get("/callback", passport.authenticate("linkedin", { 
    successRedirect: `${process.env.SERVER}/auth/LinkedIn/success`,
    failureRedirect: `${process.env.SERVER}/auth/LinkedIn/fail`
}));

module.exports = router;
