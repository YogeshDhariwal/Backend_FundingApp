import mongoose, { model } from "mongoose";

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
     avatar:{
        type:String,
        reqired:true,
     },
     coverImage:{
        type:String,
     },
     razarPay_Id:{
        type:String,
        required:true,
        unique:true
     },
     razoPay_Secret:{
        type:String,
        required:true,
     }
 

},{timestamps:true})

export const User = mongoose.model("User",userSchema);