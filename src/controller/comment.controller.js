import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Comment} from '../model/comment.model.js'
import { Post } from "../model/post.model.js";
import { Membership } from "../model/membership.model.js";
import mongoose from "mongoose";
/** comment on video */
const commentOnPost = asyncHandler(async(req,res)=>{
    const {comment} =req.body
    const {postId}=req.params

    if(!comment && !postId){
        throw new ApiError(400,"video is not avaialble or comment is not valid")
    }
    
  if(!(mongoose.Types.ObjectId.isValid(postId))){
    throw new ApiError(400,"Invalid Id")
  }
    const post = await Post.findOne({_id:postId}).select('accessLevel')
    if(!post){
        throw new ApiError(400,"Post not found")
    }
    console.log("post",post)
  const membership = await Membership.findOne({owner:req.user._id}).select("planType")

 const userPlan = membership?.planType || "Public"
  const planRanks = {"Public":0,"Basic":1,"Pro":2, "Premium":3}
  if(planRanks[post.accessLevel]<=planRanks[userPlan]){
   
    const createComment = await Comment.create({
        owner:req.user._id,
        commentOnVideo:comment,
        postId: postId
    })

     
    if(!createComment){
        throw new ApiError(500,"Something went wrong while creating comment ")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,createComment,"Commented successfully on th video")
    )
  }
  else{
    throw new ApiError(404,"Sorry you cann't comment on that post upgrade your plan")
  }  

})

const getCommentPost = asyncHandler(async(req,res)=>{
    const {userId}=req.params
    const comments = await Comment.aggregate([
        {
            $match:{userId:req.user._Id}   
        },
        {
            $lookup:{
                from:"posts",
                localField:"postId",
                foreignField:"_id",
                as:"videoPostDetails",
                pipeline:[
                    {
                        $project:{
                             videoTitle:1,
                            videoFile:1,
                            owner:1,
                            accessLevel:1           
                        }
                    }
                ]
            }
        },
        {
            $lookup:{
             from :"posts",
             localField:"postId",
             foreignField:"_id",
             as:"messagePostDetails",
             pipeline:[
                {
                    $project:{
                        message:1,
                        accessLevel:1,
                        owner:1
                    }
                }
             ]
            }
        },
        {
            $facet:{
                posts:[],
                totalCount:[{$count:"count"}]
            }
        }
    ])
    const totalComments = comments[0]?.totalCount[0]?.count || 0

    return res
    .status(200)
    .json(
        new ApiResponse(200,[comments,totalComments],"All post is fetched successfully where you comment")
    )
})
export {
    commentOnPost,
    getCommentPost
}

