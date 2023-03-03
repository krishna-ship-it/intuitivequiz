const express = require("express");
const questionController = require("./../controllers/questionController");
const auth = require("./../middlewares/auth");
const Router = express.Router();

Router.route("/:quesId").delete(auth, questionController.deleteQuestion);
module.exports = Router;
