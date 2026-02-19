import mongoose from 'mongoose'

const memberShipSchema = new mongoose.Schema(
    {
     planTypes :{
            type:String,
            enum:["Basic", "Pro" ,"Premium"],
            required:true
    },
    proPrice:{
        type:Number,
        default:50
    },
   
    basicPrice:{
        type:Number,
        default:30
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
        ref:"Post"
    },
],
    validTime:{
        type:Number,
        default:365
    }

},{timestamps:true})

export const Membership =mongoose.model("Membership",memberShipSchema)