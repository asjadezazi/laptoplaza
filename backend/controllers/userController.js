const ErrorHandler = require("../utils/errorhandler")
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel")


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

 const token = user.getJwtToken()
 res.status(201).json({
 success:true,
 token, })
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

    const token = user.getJwtToken()
    res.status(201).json({
    success:true,
    token, })

})

