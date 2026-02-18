import mongoose from 'mongoose'

const earningSchema = new mongoose.Schema(
    {
       monthlyEarning:{
        type:Number,
        default:0
       },
       yearlyEarning:{
        type:Number,
        default:0
       },
       totalEarning:{
        type:Number,
        default:0
       },
       earnFromSubscriber:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Subscriber"
    },
    {
        moneyDonated:{
            type:Number,
            default:"50"
        }
    }
       ],
       earnFromMemberShip:[
        {type:mongoose.Schema.Types.ObjectId,
            ref:"Membership"
        },
        {
            moneyFromMemberShip:{
                type:Number,
                enum:[{"pro":50},{"basic":20},{"premium":100}]
            }
        }
       ]

    },{timestamps:true})

 export const Earnings = mongoose.model("Earning",earningSchema)