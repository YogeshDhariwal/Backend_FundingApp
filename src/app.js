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
import subscriptionRoutes from './routes/membership.route.js'
import postRouter from './routes/post.route.js'
import paymentRouter from './routes/payment.route.js'
import commentRouter from './routes/comment.route.js'

app.use("/api/v1/users",userRoutes)
app.use("/api/v1/memberships",subscriptionRoutes)
app.use('/api/v1/posts',postRouter)
app.use('/api/v1/payments',paymentRouter)
app.use('/api/v1/comments',commentRouter)



export {app}