import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Payment } from "../model/payment.model.js";
import { Membership } from "../model/membership.model.js";
import { Post } from "../model/post.model.js";
import { razorpayInstance } from "../utils/razorpay.js";
import { getAccessibleLevels } from "../utils/access.js";
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
      // Razorpay expects amount in paise
      const amountInPaise = amount * 100;
      const order = await razorpayInstance.orders.create({
        amount: amountInPaise,
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
      // Return the order details and the public key for frontend Razorpay initialization
      return res.status(201).json(
        new ApiResponse(201, { payment, order, key: process.env.RAZORPAY_KEY_ID }, "Order is created successfully")
      )
      
})

/** verify payment */
const verifyPayment = asyncHandler(async(req,res)=>{
    const  {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
    } =req.body

    if(!razorpay_order_id || ! razorpay_payment_id  || !razorpay_signature){
        throw new ApiError(400,"Payment data is missing")
    }
    const body =razorpay_order_id + "|" + razorpay_payment_id;
    console.log('expected signature',body);
    const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex")
    if(expectedSignature !== razorpay_signature){
        throw new ApiError(400,"Payment verification failed")
    }
    
    // Find the payment by the orderId field and mark it as Success
    const payment = await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        status: "Success",
        currency: "INR",
        paymentId: razorpay_payment_id,
      },
      { new: true }
    )

    if(!payment){
      throw new ApiError(404,"Payment record not found for this order")
    }

    // Grant membership after successful payment verification
    const allowedLevels = getAccessibleLevels(payment.planType)
    const posts = await Post.find({
      accessLevel: { $in: allowedLevels }
    }).select("_id")

    const membership = await Membership.findOneAndUpdate(
      { owner: payment.sender },
      {
        planType: payment.planType,
        price: payment.amount,
        status: "Active",
        benefits: posts.map(p => p._id),
        validTime: 365
      },
      { new: true, upsert: true }
    )

    if(!membership){
      throw new ApiError(500,"Error while granting membership")
    }

    return res.status(200).json(
      new ApiResponse(200, { payment, membership }, "Payment verified successfully and membership granted")
    )
})
  

export {
    createOrder,
    verifyPayment
}