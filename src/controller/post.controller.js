 import { asyncHandler } from "../utils/asyncHandler.js";
 import { ApiError } from "../utils/ApiError.js";
 import { ApiResponse } from "../utils/ApiResponse.js";
 import { Post } from "../model/post.model.js";
 import mongoose from "mongoose";
 import { uploadOnCloudinary } from "../utils/cloudinary.js";

 /** post video */
 const postVideo = asyncHandler(async(req,res)=>{

    const  {description} =req.body

    if( ! description){
        throw new ApiError(400,"please upload video and its description")
    }

    const videoFilePath =   req.files?.video[0]?.path
    
    const video = await uploadOnCloudinary(videoFilePath)
    if(!video.url){
        throw new ApiError(500,"error while uploading video ")
    }
     const post = await Post.create({
        video : video.url,
         description:description,
        owner:req.user._id
     })
    return res
    .status(200)
    .json(
        new ApiResponse(201,post,"A post is created successfully")
    )

 })

 /** post a message */
 const postMessage = asyncHandler(async(req,res)=>{

    const  { message ,isPublished} = req.body
    if(!message){
        throw new ApiError(400,"please write a message")
    }

    const post = await Post.create({
        message:message,
        owner:req.user._id,
        isPublished:isPublished
    })

    return res
    .status(200)
    .json(
        new ApiResponse(201,post ,"A message post is successfully created")
    )
 })

 /** delete video */
 const deletePostedVideo =asyncHandler(async(req,res)=>{
    const { postVideoId} = req.params
     


    if(!mongoose.Types.ObjectId.isValid(postVideoId)){
        throw new ApiError("invalid id")
    }

    const post = await Post.findById(
       postVideoId
    )
   
  if(!post){
    throw new ApiError(400,"that video is not available")
  }
    await post.deleteOne()

    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"posted video is deleted successfully")
    )
 })

/** delete posted message */
const deletePostedMessage = asyncHandler(async(req,res)=>{
    const  { postedMessageId}  =req.params

    if(!mongoose.Types.ObjectId.isValid(postedMessageId)){
        throw new ApiError(400,"Invalid Id")
    }

    const post = await Post.findById(postedMessageId)
    if(!post){
        throw new ApiError(400,"post is not available")
    }
 
     await post.deleteOne()
     return res
     .status(200)
     .json(
        new ApiResponse(200,{},"Posted Message is deleted successfully")
     )
})
 /** get all posts */
const getAllPosts = asyncHandler(async(req,res)=>{
   
const {page=1,limit=10,sortBy,sortType}=req.params

const pageNumber = Number(page)
const limitNumber = Number(limit)
const skip = (pageNumber - 1)*limitNumber


  const sortStage = {
    [sortBy] :sortType==="asc"?1:-1
  }
 
    const allPosts = await Post.aggregate([
        {
            $match:{
                owner: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
        $lookup:{
            from:"users",
            localField:"owner",
            foreignField:"_id",
            as:"allPostDetails",
           pipeline:[{
            $project:{
                fullName:1,
                userName:1,
                email:1
            }
           }]
        }
        },
        {
        $sort:sortStage
        },
        {
            $facet:{
             Posts : [{$skip:skip},{$limit:limitNumber}] ,
             totalCount:[{$count:"count"}]
            }
        }
    ])

    const totalPosts = allPosts[0]?.totalCount[0]?.count || 0
    const totalPage = Math.ceil(totalPosts/limitNumber)

    return res
    .status(200)
    .json(
        new ApiResponse(200,[allPosts[0],{totalPosts:totalPosts},{totalPage:totalPage}],"All posts fetched successfully")
    )
})

export {
    postVideo,
    postMessage,
    deletePostedVideo,
    deletePostedMessage,
    getAllPosts
 }