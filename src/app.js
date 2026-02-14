import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app =express()
/** to remove cors origin error while using the express app */
app.use(cors({
  origin:process.env.CORS_ORIGIN,
  credentials:true
}))

app.use(express.json({limit:"10kb"}))

app.use(express.urlencoded({extended:true,limit:"10kb"}))

app.use(cookieParser())

import userRoutes from './routes/user.route.js'

app.use("/api/v1/users",userRoutes)

export {app}