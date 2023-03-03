const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        minlength:3,
        maxlength:20,
        required:[true,"name is required"]
    },
    email:{
        type:String,
        minlength:6,
        maxlength:25,
        validate:{

        },
        required:[true,"email is required"],
        unique:[true,"email should be unique"],
        validate:{
            validator:function(val){
                return (val.includes('@') && val.includes('.'))
            },
            message:'enter a valid email'
        }
    },
    imgUrl:{
        type:String
    },
    imgPublicId:{
        type:String
    },
    password:{
        type:String,
        minlength:8,
        maxlength:16,
        required:[true,"password is required"],
    },
    confirmPassword:{
        type:String,
        minlength:8,
        maxlength:16,
        required:[true,"confirm password is required"],
        validate:{
            validator:function(val)
            {
                return val === this.password;
            },
            message:"confirm password can't be different from password"
        }
    }
})
userSchema.pre('save',async function(next){
    if(!this.isModified('password'))
        return next();
    this.password = await bcrypt.hash(this.password,12);
    this.confirmPassword = undefined;
})

module.exports =  mongoose.model('User',userSchema);