import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Membership } from "../model/membership.model.js";
import { Post } from "../model/post.model.js";
import { getAccessibleLevels } from "../utils/access.js";


/** get membership details for current user */
const getMembership = asyncHandler(async(req,res)=>{
    const membership = await Membership.findOne({ owner: req.user._id })
    
    if(!membership){
        throw new ApiError(404,"No active membership found")
    }

    return res
     .status(200)
     .json(
        new ApiResponse(200, membership, "Membership details retrieved")
     )
})

/** upgrading plan */ 
const upgradePlan = asyncHandler(async(req,res)=>{
   const { newPlan } = req.body
   if(!newPlan){
      throw new ApiError(400,"please select a plan")
   }

   const membership = await Membership.findOne({ owner: req.user._id })
   
   if(!membership){
      throw new ApiError(404,"No membership found. Please purchase a plan first")
   }

   // Check if upgrading to same or lower plan
   const planRanks = { "Basic": 1, "Pro": 2, "Premium": 3 }
   if(planRanks[newPlan] <= planRanks[membership.planType]){
      throw new ApiError(400,"Can only upgrade to a higher plan")
   }

   const allowedLevels = getAccessibleLevels(newPlan)
   const posts = await Post.find({
      accessLevel: { $in: allowedLevels }
   }).select("_id")

   const updatedMembership = await Membership.findOneAndUpdate(
      { owner: req.user._id },
      {
         planType: newPlan,
         benefits: posts.map(p => p._id)
      },
      { new: true }
   )

   if(!updatedMembership){
      throw new ApiError(500,"Error while upgrading plan")
   }

   return res
     .status(200)
     .json(
        new ApiResponse(200, updatedMembership, `Plan upgraded to ${newPlan}`)
     )
})

/** deactivate/cancel membership */
const cancelMembership = asyncHandler(async(req,res)=>{
   const membership = await Membership.findOneAndUpdate(
      { owner: req.user._id },
      { status: "Expired" },
      { new: true }
   )

   if(!membership){
      throw new ApiError(404,"No membership found")
   }

   return res
     .status(200)
     .json(
        new ApiResponse(200, membership, "Membership cancelled successfully")
     )
})

export {  
    getMembership,
    upgradePlan,
    cancelMembership
}
