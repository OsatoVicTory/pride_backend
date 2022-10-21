const { appError } = require("../../utils/errorsHandler/errorsHandler");
const catchAsync = require("../../utils/errorsHandler/catchAsync");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// const { MYSECRET } = process.env;

exports.authUser = catchAsync(async (req, res, next) => {

    
    let token;
    if(req.headers.authorizations) {
        let splittedHeader = req.headers.authorization.split(" ");
        if(splittedHeader[0] !== "Bearer") return appError(res, 401, "No Authorization Tokens");
        token = splittedHeader[1];
    } else if(req.cookies.PRIDE_TOKEN) {
        token = req.cookies.PRIDE_TOKEN;
    }

    
    if(!token) return appError(res, 400, "Not Logged In. Redirecting to Log In Page");

    const decodedToken = await jwt.verify(token, process.env.MYSECRET);

    
    if(!decodedToken) return appError(res, 400, "Not Logged In. Redirecting to Log In Page");

    req.user = decodedToken;
    
    next();
});
