import mongoose from 'mongoose'

const subscriberSchema = new mongoose.Schema(
    {
       channel :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
      },
    SubscribedByYou :{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
    }

    },{timestamps:true})

export const Subscription = mongoose.model("Subscription",subscriberSchema)