import mongoose from 'mongoose'

const membershipSchema = new mongoose.Schema(
    {
     planType :{
            type:String,
            enum:["Basic", "Pro" ,"Premium"],
            required:true
    },
    price:{
    type:Number
    },
    owner:{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        unique:true,
    },
    benefits:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    },
],
    validTime:{
        type:Number,
        default:365
    }

},{timestamps:true})

membershipSchema.pre("save", function () {
  if (this.planType === "Basic") {
    this.price = 30;
  } else if (this.planType === "Pro") {
    this.price = 50;
  } else if (this.planType === "Premium") {
    this.price = 100;
  }

});

export const Membership =mongoose.model("Membership",membershipSchema)
