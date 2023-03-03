const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const cookieParser = require("cookie-parser");
const profileRoutes = require("./routes/profileRoutes");
const globalError = require("./middlewares/globalError");
const quizRoutes = require("./routes/quizRoutes");
const questionRoutes = require("./routes/questionRoutes");
const connectDB = require("./utils/db");

dotenv.config({
  path: "./config.env",
});

connectDB(process.env.MONGO_URL);

app.use(express.json());
app.use(cookieParser());
app.use("/", profileRoutes);
app.use("/quiz", quizRoutes);
app.use("/questions", questionRoutes);

cloudinary.config({
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  cloud_name: process.env.CLOUD_NAME,
});

const port = process.env.PORT || 8080;

// app.all("*",(req,res,next)=>{
//     next(new AppError("Route does not exists",404));
// })
app.use(globalError);

app.listen(port, () => {
  console.log(`listening on port ${port}....`);
});
