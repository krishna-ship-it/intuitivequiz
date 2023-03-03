const AppError = require("./../utils/AppError");
const User = require("./../models/userModel");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const util = require("util");
const catchAsyncError = require("./../utils/CatchAsyncError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const signJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "90d" });
};
const checkPassword = async (enteredPass, hashedPass) => {
  return await bcrypt.compare(enteredPass, hashedPass);
};
const destroyImgFromCloudinary = async (public_id, user) => {
  console.log("pi", public_id);
  const imgDestroyPromise = util.promisify(cloudinary.uploader.destroy);
  await imgDestroyPromise(public_id);
  user.imgUrl = undefined;
  user.imgPublicId = undefined;
};

exports.singup = catchAsyncError(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  const user = await User.create({ name, email, password, confirmPassword });

  const token = signJWT(user._id);
  res.cookie("token", token, { maxAge: 2592000000 });
  res.status(201).json({
    token,
  });
});

exports.login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("enter valid email or password", 400));
  const user = await User.findOne({ email });
  if (!user) return next(new AppError("user does not exists", 401));
  if (!(await checkPassword(password, user.password)))
    return next(new AppError("incorrect password", 401));

  const token = signJWT(user._id);
  res.cookie("token", token, { maxAge: 2592000000 });
  res.status(200).json({
    token,
  });
});

// upload profile picture
// @private
// one picture can be uploaded at one time

exports.uploadImage = catchAsyncError(async (req, res, next) => {
  if (!req.file) return next(new AppError("please select a profile picture"));
  const cloudPromise = util.promisify(cloudinary.uploader.upload);
  const result = await cloudPromise(req.file.path);
  const user = await User.findById(req.user.id);

  if (user.imgUrl) {
    await destroyImgFromCloudinary(result.public_id, user);
  }
  user.imgUrl = result.secure_url;
  user.imgPublicId = result.public_id;
  await user.save({ validateBeforeSave: false });

  fs.rm(`${__dirname}/../${req.file.path}`, (err) => {
    if (err) console.log(err);
  });
  res.status(200).json({ msg: "profile picture uploaded" });
});

// @private
exports.changePassword = catchAsyncError(async (req, res, next) => {
  const { prePass, newPass, confirmPassword } = req.body;
  if (!prePass || !newPass || !confirmPassword)
    return next(
      new AppError(
        "old password, new password or confirm password can't be empty",
        400
      )
    );
  const user = await User.findById(req.user.id);
  if (!(await checkPassword(prePass, user.password)))
    return next(new AppError("wrong password", 401));

  user.password = newPass;
  user.confirmPassword = confirmPassword;

  await user.save();
  res.status(200).json({
    message: "password changes",
  });
});

// @private

exports.deleteAccount = catchAsyncError(async (req, res, next) => {
  const { password } = req.body;
  if (!password) return next(new AppError("please enter your password"));
  const user = await User.findById(req.user.id);

  if (!(await checkPassword(password, user.password)))
    return next(new AppError("Wrong password", 401));
  if (user.imgPublicId) {
    await destroyImgFromCloudinary(user.imgPublicId, user);
  }

  await User.findByIdAndDelete(req.user.id);
  res.status(200).json({ message: "account deleted" });
});
