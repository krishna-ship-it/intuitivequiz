const mongoose = require("mongoose");
const User = require("./userModel");
const Quiz = require("./quizModel");
const Question = require("./questionModel");
const responseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "user is requied"],
    ref: "User",
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "quiz is requied"],
    ref: "Quiz",
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "question is requied"],
    ref: "Question",
  },
  selectedOption: {
    type: Number,
    default: -1,
  },
  isCorrect: {
    type: Boolean,
    default: false,
  },
  score: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("UserResponse", responseSchema);
