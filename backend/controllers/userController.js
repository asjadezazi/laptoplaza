const ErrorHandler = require("../utils/errorhandler")
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail=  require("../utils/sendEmail");


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



// Forgot Password

exports.forgotPassword = catchAsyncError(async(req,res,next)=>{

const user = await User.findOne({email:req.body.email});

if(!user){
    return  next (new ErrorHandler('There is no account with that email',404))
}


const resetToken =  user.getResetPasswordToken();

await user.save({validateBeforeSave:false});

// url generate 

const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`

  const message = `Your password reset token in :- \n\n ${ resetPasswordUrl}\n\n If you have not requested this email
  then please ignore it`;

  try{
await sendEmail({
    email:user.email,
    subject:`Laptoplaza Password Recovery`,
    message,
})

res.status(200).json({
    success:true,
    message:`Email sent to ${user.email} successfully`
})


  }catch(error){
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire= undefined ;
   await user.save({validateBeforeSave:false});
   return next(new ErrorHandler(err.message, 500))

  }
 })



