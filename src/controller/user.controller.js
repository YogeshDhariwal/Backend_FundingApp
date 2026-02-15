import mongoose from "mongoose";
import  { User}  from '../model/user.model.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError } from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshTokens = async(userId)=>{
   try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
 
    user.refreshToken = refreshToken
    await user.save({validateBeforeSave:false})
 
    return {accessToken,refreshToken}
   } catch (error) {
       console.log('something error while generating access and refresh token',error);
   }

}

/** register user */

  const registerUser = asyncHandler(async(req,res)=>{
   
   const {email,fullName,userName,password,razorPay_Id,razorPay_Secret} =req.body
   if([email,userName,fullName,password,razorPay_Id,razorPay_Secret].some((fields)=>{
        fields?.trim()===""
   })
)  {
    throw new ApiError(400,"All fields are required to fill")
   }
  
   const existedUser = await User.findOne({
  $or:[{email},{userName}]
})
   if(existedUser){
    throw new ApiError(409,"This user is already registered")
   }
     
    const avatarLocalFilePath = req.files?.avatar[0]?.path

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.path.length >0){
       coverImageLocalPath=req.files?.coverImage[0]?.path
    }
   if(!avatarLocalFilePath){
    throw new ApiError(400,"avatar file is required")
   }
    
   const avatar = await uploadOnCloudinary(avatarLocalFilePath)
   const coverImage =await uploadOnCloudinary(coverImageLocalPath)
   if(!avatar){
    throw new ApiError(400,"something went wrong while uploading avatar")
   }
    
   const user = await User.create({
    email:email,
    password:password,
    fullName:fullName,
    userName:userName.toLowerCase(),
  razorPay_Id:razorPay_Id,
  razorPay_Secret:razorPay_Secret,
  avatar:avatar.url,
  coverImage: coverImage?.url || " "
   })
     const createdUser = await User.findById(user._id).select(
        "-refreshToken -password -razorPay_Id -razorPay_Secret"
     )
     if(!createdUser){
        throw new ApiError(500,"something went wrong while registering user")
     }

     return res
     .status(200)
     .json(
        new ApiResponse(201,createdUser,"User is registered successfully")
     )
  })

  /** login User */
  const loginUser = asyncHandler(async(req,res)=>{
       const {email,userName,password}=req.body

   
  
       if(!(email || userName)){
         throw new ApiError(400,"Email or username is required")
       }
       if(!password){
         throw new ApiError(400,"password is required")
       }
         
       const user = await User.findOne(
         {
            $or:[{userName},{email}]
         }
       )
//   console.log('user',user);
      if(!user){
         throw new ApiError(404,"Invalid email or username")
      }
      
      

      const correctPassword = await user.isPasswordCorrect(password)
      if(!correctPassword){
         throw new ApiError(400,"Incorrect Password")
      }
    
      const {accessToken ,refreshToken } = await generateAccessAndRefreshTokens(user._id)
     

      const loggedInUser = await User.findById(user._id).select(
         "-password -refreshToken -razorPay_Id -razorPay_Secret"
      )
      console.log('loggedInUser',loggedInUser);
      const options ={
    httpOnly:true,
    secure:true
      }

      return res
      .status(200)
      .cookie("AccessToken",accessToken,options)
      .cookie("RefreshToken",refreshToken,options)
      .json(
         new ApiResponse(200,
            {user:loggedInUser ,accessToken ,refreshToken},
            "Logged in successfully"

         )
      )
  })

  /** logout */


  export{
    registerUser,
    loginUser
  }