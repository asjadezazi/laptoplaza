const ErrorHandler = require("../utils/errorhandler")
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");


// Register a User 

exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:"this is sample public id",
            url:"profile pic url"
        }})

        sendToken(user,201,res);
})


// login user 
exports.loginUser = catchAsyncError(async(req,res,next)=>{
    const {email,password} = req.body;

    // checking if user given password and email both
   if(!email || !password){
        return next(new ErrorHandler("Please provide an Email & Password!",400))
    }
    const user = await User.findOne({email}).select("+password")
     if(!user){
        return next(new ErrorHandler("Ivalid Email or Password"))
    }
    const isPasswordMatched = user.comparePassword();
   if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password"))
    }

 sendToken(user,200,res);
})



//Logout User


exports.logout= catchAsyncError(async(req,res,next)=>{

    res.cookie("token",null,{
        expires : new Date(Date.now()),

    });






    res.status(200).json({
        success:true,
        message:"Logged Out"
    })

})


