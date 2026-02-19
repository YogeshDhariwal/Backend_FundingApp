import  mongoose from 'mongoose'

const postSchema = new mongoose.Schema(
    {
   video:{
    type:String
   },
   description:{
    type:String
   },
   isPublished:{
    type: Boolean,
    default:true

   },
   message:{
    type:String,

   },
   owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
   }

    },{timestamps:true})

export const Post = mongoose.model("Post",postSchema)