import mongoose from "mongoose";
const paymentSchema = new mongoose.Schema(
   {
      sender: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true
      },
      paymentId:{
         type:String
      },
      planType: {
         type: String,
         enum: ["Basic", "Pro", "Premium"],
         required: true
      },

      orderId: {
         type: String,
         required: true,
         unique: true
      },
      amount: {
         type: Number,
         required: true
      },
      status: {
         type: String,
         enum: ["Success", "Pending", "Failed"],
         default: "Pending"
      },
      currency: {
         type: String,
         default: "INR"
      },



   }, { timestamps: true })

export const Payment = mongoose.model("Payment", paymentSchema);