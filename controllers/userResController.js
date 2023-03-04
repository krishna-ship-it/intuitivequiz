const catchAsyncError = require("./../utils/CatchAsyncError");
const UserResponse = require("./../models/userResponseModel");
const Question = require("./../models/questionModel");
const AppError = require("./../utils/AppError");
exports.postRes = catchAsyncError(async (req, res, next) => {
  const quesId = req.params.quesId;
  const quizId = req.params.quizId;

  const { selectedOption } = req.body;

  const question = await Question.findById(quesId).select("+correctOption");

  let isCorrect =
    question.correctOption === question.options[selectedOption * 1]
      ? true
      : false;

  // checking the user, is he/she submitted answer for this quiz before
  const isPresent = await UserResponse.findOne({
    user: req.user.id,
    quiz: quizId,
    question: quesId,
  });
  if (isPresent)
    return next(
      new AppError("You can't submit the answer,you already attempted it", 400)
    );

  const userResponse = await UserResponse.create({
    user: req.user.id,
    quiz: quizId,
    question: quesId,
    selectedOption,
    isCorrect,
  });
  res.status(200).json({
    userResponse,
    isCorrect,
  });
});

exports.getScoreByQuiz = catchAsyncError(async (req, res, next) => {
  const result = await UserResponse.find({
    user: req.user.id,
    quiz: req.params.quizId,
  });

  const summary = {};
  summary.totalQuestion = result.length;

  let totalCorrect = 0;
  result.forEach((r) => {
    if (r.isCorrect) totalCorrect++;
  });

  summary.totalCorrect = totalCorrect;

  if (result.length > 0)
    summary.percentage = (totalCorrect / result.length) * 100;
  res.status(200).json({
    summary,
  });
});

exports.getDetailedResult = catchAsyncError(async (req, res, next) => {
  const result = await UserResponse.find({
    user: req.user.id,
    quiz: req.params.quizId,
  }).populate({
    path: "question quiz",
    select: "correctOption title options name",
  });
  res.status(200).json({
    result,
  });
});
