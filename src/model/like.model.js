import mongoose from 'mongoose'

const likeSchema=new mongoose.Schema(
    {
     atVideo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
     },
     atMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
     },
     likedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
     }

    },{timestamps:true})

export const Like = mongoose.model("Like",likeSchema)