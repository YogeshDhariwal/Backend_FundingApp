import mongoose from 'mongoose'

const earningSchema = new mongoose.Schema({},{timestamps:true})

 export const Earnings = mongoose.model("Earning",earningSchema)