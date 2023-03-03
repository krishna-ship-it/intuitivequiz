const mongoose = require("mongoose");
const Question = require("./questionModel");
const quizSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "quiz name is required"],
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    description: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
quizSchema.virtual("questions", {
  ref: "Question",
  localField: "_id",
  foreignField: "quizId",
});

module.exports = mongoose.model("Quiz", quizSchema);
