import dotenv from 'dotenv'
import { app } from './app.js'


dotenv.config({
    path:'./env'
})
import connectDb from './db/index.js'
connectDb()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`App is listening at port ${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.log("MongoDb connection is failed!",error)
})