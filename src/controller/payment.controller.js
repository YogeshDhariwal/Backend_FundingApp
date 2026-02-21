import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Payment } from "../model/payment.model.js";
import { razorpayInstance } from "../utils/razorpay.js";
import crypto from "crypto"

/** creating order */
const createOrder = asyncHandler(async(req,res)=>{
      const {planType} =req.body
      if(!planType){
        throw new ApiError(400,"select a plan")
      }

      const planPrice = {
        Basic: 3000,
        Pro:5000,
        Premium :10000
      }

      const amount = planPrice[planType]
      if(!amount){
        throw new ApiError(400,"Invalid plan")
      }
      const order = await razorpayInstance.orders.create({
        amount,
        currency:"INR",
        receipt: crypto.randomBytes(10).toString("hex")
      })
   
      if(!order){
        throw new ApiError(500,"Something went wrong while creating order")
      }
      const payment = await Payment.create({
        sender:req.user._id,
        amount,
        planType,
        orderId:order.id,
        status :"Pending"
      })
   
      return res
      .status(200)
      .json(
        new ApiResponse(201,[payment,order],"Order is created successfully")
      )
      
})

/** verify payment */

export {
    createOrder
}