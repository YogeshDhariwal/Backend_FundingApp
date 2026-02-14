import mongoose from 'mongoose'

const memberShipSchema = new mongoose.Schema(
    {
    pro:{
        type:String,
    },
    basic:{
        type:String
    },
    premium:{
        type:String,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    validTime:{
        type:Number,
        default:"365 DAYS"
    }

},{timestamps:true})

export const Membership =mongoose.model("Membership",memberShipSchema)