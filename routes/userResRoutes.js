const express = require("express");
const Router = express.Router();
const userResController = require("./../controllers/userResController");
const auth = require("./../middlewares/auth");

Router.route("/:quizId/:quesId").post(auth, userResController.postRes);
Router.route("/:quizId/summary").get(auth, userResController.getScoreByQuiz);

Router.route("/:quizId/details").get(auth, userResController.getDetailedResult);
module.exports = Router;
