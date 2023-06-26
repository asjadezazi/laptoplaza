const mongoose = require("mongoose");
const validator = require("validator")
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    name: {
        type : String, 
        required:[true, "Please Enter Your Name"],
        maxLength:[30, "Name cannot exceeed 30 character"],
        minLength:[5,"Name must be atleast of length 5"]

    },
    email:{
        type : String, 
        required:[true, "Please Enter Your Email"],
        unique:true,
        validator:[validator.isEmail,"Please Enter a valid Email"]   
},
password:{
    type :String, 
    required:[true,'Password is Required'],
     minlength:[8,'Minimum Password Length should be more than or equal to 8'],
    select:false,
},
avatar:{
    public_id: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
},
role:{
    type:String,
    default:"Admin",
},

resetPasswordToken:String,
resetPasswordExpire:Date,

})


// bcrypt hash password 

userSchema.pre("save", async function(next){
if(!this.isModified("password")){
      next()
}
  this.password = await bcrypt.hash(this.password, 10) 

})

// jwt token generate 
userSchema.methods.getJwtToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRE,
    })
}

// compare password 
userSchema.methods.comparePassword = async function (enteredPassword) {
      return await bcrypt.compare(enteredPassword,this.password)
}



module.exports=mongoose.model("User", userSchema)