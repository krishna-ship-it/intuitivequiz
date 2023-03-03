const express = require("express");
const quizModel = require("./../models/quizModel");
const quizController = require("./../controllers/quizController");
const questionController = require("./../controllers/questionController");
const auth = require("./../middlewares/auth");
const Router = express.Router();

// @private
Router.route("/").post(auth, quizController.createQuiz);

Router.route("/:id")
  .delete(auth, quizController.deleteQuiz)
  .get(quizController.getQuiz)
  .post(auth, questionController.createQuestion);

module.exports = Router;
