import { ApiError } from "../utils/ApiError.js";
import jwt from 'jsonwebtoken'
import { User } from "../model/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const verifyJwt = asyncHandler(async(req,res,next)=>{
     try {
        const token = await req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer ","")
       console.log('token',token);
        if(!token){
           throw new ApiError(401,"Unauthorized Request")
        }
   
        const decodeToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        console.log('token',decodeToken);
   
        const user = await User.findById(decodeToken?._id).select("-password -refreshToken -razorPay_Id -razorPay_Secret")
        console.log('user',user);
        if(!user){
           throw new ApiError(400,"Invalid access request")
        }
        req.user =user;
        next()
     } catch (error) {
       throw new ApiError(401,"error while verifyJwt")
     }

})