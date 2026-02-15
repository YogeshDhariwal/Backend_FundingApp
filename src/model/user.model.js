import mongoose, { model } from "mongoose";
import bcrypt from 'bcrypt'

import jwt from 'jsonwebtoken'

const userSchema =new mongoose.Schema(
    {
     userName:{
        type:String,
        required:true,
        unique:true
     },
     fullName:{
        type:String,
        required:true,
     },
     email:{
        type:String,
        required:true,
        unique:true
     },
     password:{
      type:String,
      required:true
     },
     avatar:{
        type:String,
        reqired:true,
     },
     coverImage:{
        type:String,
     },
     razorPay_Id:{
        type:String,
        required:true,
        unique:true
       
     },
     razorPay_Secret:{
        type:String,
        required:true,
        unique:true
     },
     refreshToken:{
      type:String
     }
 

},{timestamps:true})

userSchema.pre("save",async function(next){
   if(! this.isModified("password")) return;
this.password= await bcrypt.hash(this.password,10)
})

userSchema.methods.isPasswordCorrect =async function(password){
   return  await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken =  function(){
  return jwt.sign(
   {
    _id:this._id,
    email:this.email,
    userName:this.userName,
    fullName:this.fullName,
  },
  process.env.ACCESS_TOKEN_SECRET,
  {
   expiresIn:process.env.ACCESS_TOKEN_EXPIRY
  }
)
}

userSchema.methods.generateRefreshToken =function(){
   return jwt.sign({
      _id:this._id
   },
   process.env.REFRESH_TOKEN_SECRET,
   {
      expiresIn:process.env.REFRESH_TOKEN_EXPIRY
   }
)
}
export const User = mongoose.model("User",userSchema);