import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
    {
      commentOnVideo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
      },
      commentOnPost:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
      }

    },{timestamps:true})

export const Comment = mongoose.model("Comment",commentSchema)