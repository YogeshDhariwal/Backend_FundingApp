import mongoose from 'mongoose'

const likeSchema=new mongoose.Schema(
    {
     atVideo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
     },
     atPost:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
     },
     atComment:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Comment"
     },
     likedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
     }

    },{timestamps:true})

export const Like = mongoose.model("Like",likeSchema)