const mongoose= require("mongoose");
const connectDB = async (str)=>{
    try{
       await mongoose.connect(str);
       console.log("connected to db");
    }
    catch(err)
    {
        console.log(err);
    }
}
module.exports = connectDB;