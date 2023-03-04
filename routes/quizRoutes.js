const express = require("express");
const quizModel = require("./../models/quizModel");
const quizController = require("./../controllers/quizController");
const questionController = require("./../controllers/questionController");
const auth = require("./../middlewares/auth");
const Router = express.Router();

Router.route("/")
  .post(auth, quizController.createQuiz)
  .get(quizController.getAllQuiz);

Router.route("/:id")
  .delete(auth, quizController.deleteQuiz)
  .get(quizController.getQuiz)
  .post(auth, questionController.createQuestion);

module.exports = Router;
