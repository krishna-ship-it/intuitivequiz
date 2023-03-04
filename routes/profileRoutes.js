const express = require("express");
const Router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "./uploads" });
const prfileController = require("./../controllers/profileController");
const auth = require("./../middlewares/auth");

Router.route("/signup").post(prfileController.singup);
Router.route("/login").get(prfileController.login);
Router.route("/upload-picture").post(
  auth,
  upload.single("file"),
  prfileController.uploadImage
);
Router.route("/change-password").patch(auth, prfileController.changePassword);
Router.route("/")
  .delete(auth, prfileController.deleteAccount)
  .get(auth, prfileController.getLoggedInUser);
module.exports = Router;
