const catchAsyncError = require("./../utils/CatchAsyncError");
const Quiz = require("./../models/quizModel");
const AppError = require("./../utils/AppError");
exports.createQuiz = catchAsyncError(async (req, res, next) => {
  const { name, description } = req.body;
  const host = req.user.id;
  await Quiz.create({ name, description, host });
  res.status(200).json({
    message: "quiz created",
  });
});
exports.getQuiz = catchAsyncError(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id).populate("questions");
  res.status(200).json({
    quiz,
    totalQuestions: quiz.questions.length,
  });
});

exports.deleteQuiz = catchAsyncError(async (req, res, next) => {
  const quizId = req.params.id;
  const quiz = await Quiz.findOne({ host: quizId });

  // checking whether the logged in user has rights to delete the quiz or not
  if (quiz.host.to_string() !== req.user.id)
    return next(new AppError("You can't delete this quiz", 401));

  await Quiz.findByIdAndDelete(quizId);
  res.status(202).json({
    message: "quiz deleted",
  });
});
