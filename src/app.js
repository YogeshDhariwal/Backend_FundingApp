import express from 'express'
import cors from 'cors'

const app =express()
/** to remove cors origin error while using the express app */
app.use(cors({
  origin:process.env.CORS_ORIGIN,
  credentials:true
}))


export {app}