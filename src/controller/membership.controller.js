import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Membership } from "../model/membership.model.js";
import { Post } from "../model/post.model.js";

/** get basic subsciption */
const getBasicSubscription = asyncHandler(async(req,res)=>{
    const {subscriptionType} =req.body

     if(!subscriptionType){
        throw new ApiError(400,"Choose a plan")
     }
      const post = await Post.findOne({isPublished:true})
     const userPlan = await Membership.create(
          {  planTypes:subscriptionType,
            owner:req.user._id,
            benifts: [post._id]
            
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
