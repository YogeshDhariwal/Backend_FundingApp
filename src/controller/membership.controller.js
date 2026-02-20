import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Membership } from "../model/membership.model.js";
import { Post } from "../model/post.model.js";


/** get basic,pro,premium subsciption */
const getSubscription = asyncHandler(async(req,res)=>{
    const {planType} =req.body

     if(!planType){
        throw new ApiError(400,"Choose a plan")
     }
      const post = await Post.find({accessLevel:String(planType)}).select("_id")
     const userPlan = await Membership.create(
          { 
             planType:planType,
            owner:req.user._id,
            benefits: post.map(p=>p._id)
            
        }
     )

     if(!userPlan){
        throw new ApiError(500,"Error while creating a plan")
     }

     return res
     .status(200)
     .json(
        new ApiResponse(201,userPlan,`Your ${planType} is succesfull activated`)
     )
})

/** upgrading plan */ 
const upgradePlan =asyncHandler(async(req,res)=>{

   const {newPlan} = req.body
   if(!newPlan){
      throw new ApiError(400,"please select a plan")
   }
  /**  update price and benifts which is for that plan */
}) 

export {  
    getSubscription,

}
