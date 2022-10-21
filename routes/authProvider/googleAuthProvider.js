const googleStrategy = require("passport-google-oauth2").Strategy;
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const router = express.Router();
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


passport.use(new googleStrategy({
        clientID: process.env.GOOGLE_APP_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        passReqToCallback: true
    },
    async (request, accessToken, refreshToken, profile, cb) => {
        
        try {
            const { email, name, id } = profile;
            const user = await User.findOne({ email });
            if(user) {
                return cb(null, user._doc);
            }
            const userAccount = new User({
                email,
                password: id,
                firstName: name.givenName,
                lastName: name.familyName,
                createdWithProvider: "google",
                isVerified: true
            });
    
            await userAccount.save();

            return cb(null, userAccount);
        } catch (err) {
            return cb(err);
        }
    }
))

router.get("/",
    passport.authenticate("google", {
        scope: ['email', 'profile']
    }
));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});
passport.deserializeUser(function (user, cb) {
    cb(null, user);
})

router.get("/fail", function(req, res) {
    res.redirect(`${process.env.FRONTEND_URL}/login`);
})

router.get("/callback", passport.authenticate("google", { 
    failureRedirect: `${process.env.SERVER}/auth/google/fail`
}), (req, res) => {
    const token = await jwt.sign({ id: req.user._id.toString() }, process.env.MYSECRET);
    sendCookie(res, token);
    res.clearCookie("connect.sid");
    res.redirect(`${process.env.FRONTEND_URL}/app/rides`);
});

module.exports = router;
