import mongoose from 'mongoose'

import { Db_Name } from '../constant.js'

const connectDb = async()=>{

try {
     const connectionInstance =await mongoose.connect(`${process.env.MONG0_URI}/${Db_Name}`)
       console.log(`Database is successfully connected to DB host :${connectionInstance.Connection.host}`);
    
} catch (error) {
    throw error
}
   
}

export default connectDb;