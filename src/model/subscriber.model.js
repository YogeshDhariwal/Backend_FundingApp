import mongoose from 'mongoose'

const subscriberSchema = new mongoose.Schema({},{timestamps:true})

export const Subscriber = mongoose.model("Subscriber",subscriberSchema)