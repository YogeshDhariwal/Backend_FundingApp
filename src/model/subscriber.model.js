import mongoose from 'mongoose'

const subscriberSchema = new mongoose.Schema(
    {
       channel :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
      },
    subscribedByYou :{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
    }

    },{timestamps:true})

export const Subscriber = mongoose.model("Subscriber",subscriberSchema)