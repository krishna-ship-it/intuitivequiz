const mongoose = require("mongoose");
const User = require("./userModel");
const Quiz = require("./quizModel");
const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "question title is required"],
    unique: [true, "question should be unique"],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  correctOption: {
    type: String,
    required: [true, "correct answer is required"],
  },
  options: {
    type: [String],
    required: [true, "options are required"],
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
  },
});

module.exports = mongoose.model("Question", questionSchema);
