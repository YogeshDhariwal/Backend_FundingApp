import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Membership } from "../model/membership.model.js";

/** get basic subsciption */
const getBasicSubscription = asyncHandler(async(req,res)=>{
    const {subscriptionType , basicPrice} =req.body

     if(!subscriptionType){
        throw new ApiError(400,"Choose a plan")
     }
        const videoFilePath = req.files?.videos[0]?.path
     const videos = await uploadOnCloudinary(videoFilePath)
     
     if(!videos.url){
        throw new ApiError(500,"Something went wrong while uplaoding video")
     }
     const userPlan = await Membership.create(
          {  planTypes:subscriptionType,
            owner:req.user._id,
            benifts: [videos._id]
            
        }
     )

     if(!userPlan){
        throw new ApiError(500,"Error while creating a plan")
     }

     return res
     .status(200)
     .json(
        new ApiResponse(201,userPlan,"Your Basic plan is successfully activated")
     )
})


export {  
    getBasicSubscription
}
