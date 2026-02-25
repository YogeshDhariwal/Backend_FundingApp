import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js ";
import { Like} from "../model/like.model.js"
import mongoose from 'mongoose'

const toggleLikePost = asyncHandler(async(req,res)=>{
    const {postId}=req.params

    if(!(mongoose.Types.ObjectId.isValid(postId))){
        throw new ApiError(400,"Invalid Id")
    }
     const isLiked = await Like.findOne({likedAt:postId})
     if(isLiked){
       await isLiked.deleteOne()
       return res
       .status(200)
       .json(
        new ApiResponse(200,{},"like removed successfullly from post")
       )
     }
   else{
     const like = await Like.create({
        likedAt:postId,
        likedBy:req.user._id
    })

    if(!like){
        throw new ApiError(500,"Something went wrong while creating like document")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(201,like,"Post is Liked successfully")
    )
   }
})

 const toggleLikeComment = asyncHandler(async(req,res)=>{
    const {commentId} = req.params
    if(!(mongoose.Types.ObjectId.isValid(commentId))){
       throw new ApiError(400,"Invalid Id")
    }
    const isLiked = await Like.findOne({likedAt:commentId})
    if(isLiked){
     await isLiked.deleteOne()

     return res
     .status(200)
     .json(
        new ApiResponse(200,{},"like remove successfully from comment")
     )
    }
      else{
        const like = await Like.create({
        likedAt:commentId,
        likedBy:req.user._id
      })

      if(!like){
        throw new ApiError(500,"Something went wrong while creating the like document")
      }
      return res
      .status(200)
      .json(
        new ApiResponse(201,like,"Comment is liked successfully")
      )
      }
 })

 
 const getAllLikedPosts = asyncHandler(async(req,res)=>{
    const {page=1,limit=10 ,sortBy,sortType}=req.params
   
      const pageNumber = Number(page)
      const limitNumber = Number(limit)
      const skip = (pageNumber-1)*limitNumber
      const sortStage ={
         [sortBy] :sortType==="asc"?1:-1
      }

    const liked = await Like.aggregate([
        {
            $match:{
                likedBy:new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                form:"posts",
                localField:"likedAt",
                foreignField:"_id",
                as:"likedPostDetail",
                pipeline:[{
                    $project:{
                        videoTitle:1,
                        videoFile:1,
                        message:1,
                        owner:1,
                        accessLevel:1
                    }
                }]
            }
        },
        {
            $sort:sortStage
        },
        {
            $facet:{
                likedPost:[{$skip:skip},{$limit:limitNumber}],
                totalCount:[{$count:"count"}]
            }
        }
    ])
    const totalLikedPosts = liked[0]?.totalCount[0]?.count || 0
    const totalPage = Math.ceil(totalLikedPosts/limitNumber)

    return res
    .status(200)
    .json(
        new ApiResponse(200,[liked,totalLikedPosts,totalPage],"All liked post are fetched successfully")
    )
 })
export {
    toggleLikePost,
    toggleLikeComment,
    getAllLikedPosts,
}


