import mongoose from "mongoose";
 const paymentSchema = new mongoose.Schema(
    {
     sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
     },
     reciever:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
     },
     transactionId:{
        type:String,
        required:true,
        unique:true
     },
     amount:{
        type:Number,
        required:true
     },
     status:{
         type:String,
         enum:["Success","Pending","Failed"],
        default:"Pending"
     },
     currency:{
        type:String,
        default:"INR"
     },
     updatedAt:{
        type:Date,
        default:Date.now
     }



 },{timestamps:true})

 export const Payment = mongoose.model("Payment",paymentSchema);