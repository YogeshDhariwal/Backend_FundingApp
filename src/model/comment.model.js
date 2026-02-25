import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
    {
      commentOnVideo:{
        type:String,
        unique:true
      },
      postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
      },
      commentOnMessagePost:{
        type:String,
        unique:true
      },
      owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
      }
    },{timestamps:true})

export const Comment = mongoose.model("Comment",commentSchema)