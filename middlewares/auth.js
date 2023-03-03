const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const util = require('util');
const AppError = require("./../utils/AppError");
const User = require("./../models/userModel");
const authController = async (req,res,next)=>{
    const token = req.cookies.token;
    if(!token) return next(new AppError("You are not logged in now",401));
    const jwtVerifyPromise  = util.promisify(jwt.verify);
    const decoded = await jwtVerifyPromise(token,process.env.JWT_SECRET);
    if(!decoded)
        return next(new AppError("invailed token, please sign in or sign up again",401));
    const user = await User.findById(decoded.id);
    if(!user)
    return next(new AppError("user does not exists",400));
    req.user = decoded;
    next();
}

module.exports = authController;