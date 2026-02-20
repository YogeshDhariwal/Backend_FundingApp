import  mongoose from 'mongoose'

const postSchema = new mongoose.Schema(
    {
   videoFile:{
    type:String,
    
   },
   videoTitle:{
      type:String,
     
   },
   description:{
    type:String
   },
      
   accessLevel:{
     type:String,
     enum:["Public","Pro","Basic","Premium"],
     default:"Public"
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