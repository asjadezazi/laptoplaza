const ErrorHandler = require("../utils/errorhandler");

module.exports=(err,req,res,next)=>{
    err.statusCode = err.statusCode || 5000
    err.message =  err.message || "Internal server problem"


    res.status( err.statusCode).json({
        success:false,
        message:err.message,

    })
}