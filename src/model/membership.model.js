import mongoose from 'mongoose'

const memberShipSchema = new mongoose.Schema(
    {
    pro:{
        type:String,
    },
    proPrice:{
        type:Number,
        default:50
    },
    basic:{
        type:String
    },
    basicPrice:{
        type:Number,
        default:30
    },

    premium:{
        type:String,
    },
    premiumPrice:{
           type:Number,
           default:100
    },
    owner:{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    benifts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    }],
    validTime:{
        type:Number,
        default:"365 DAYS"
    }

},{timestamps:true})

export const Membership =mongoose.model("Membership",memberShipSchema)