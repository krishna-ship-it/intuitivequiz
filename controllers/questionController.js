const catchAsyncError = require("./../utils/CatchAsyncError");
const Question = require("./../models/questionModel");
const AppError = require("./../utils/AppError");

exports.createQuestion = catchAsyncError(async (req, res, next) => {
  let { title, correctOption, optionsStr } = req.body;
  const quizId = req.params.id;
  const author = req.user.id;

  if (!title) return next(new AppError("title is required", 400));
  if (!optionsStr) return next(new AppError("Options are required", 400));

  // expecting options as a , seprated string
  const options = optionsStr.split(",").map((op) => op.trim());
  // checkin the correct option is it from all options or not
  if (!correctOption)
    return next(new AppError("correct option is required", 400));

  if (!options.includes(correctOption.trim()))
    return next(
      new AppError(
        "invaild correct option,correct option must be from the all options",
        400
      )
    );
  title = title.trim();
  correctOption = correctOption.trim();
  await Question.create({ title, correctOption, options, author, quizId });
  res.status(200).json({
    message: "question created",
  });
});

exports.deleteQuestion = catchAsyncError(async (req, res, next) => {
  const quesId = req.params.quesId;
  const question = await Question.findById(quesId);
  if (!question) return next(new AppError("Question does not exists", 400));

  if (req.user.id !== question.author.toString())
    return next(
      new AppError("You can't delete this question, access denied", 401)
    );
  await Question.findByIdAndDelete(quesId);
  res.status(202).json({
    message: "question deleted",
  });
});
