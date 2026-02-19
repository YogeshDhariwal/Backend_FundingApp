import {Router} from 'express'
import { upload } from '../middleware/multer.middleware.js'
import { getUserDetails, loginUser, 
    logOut, refreshAccessToken, 
    registerUser, updateAvatar, 
    updateCoverImage, updatePassword, updatUserDetails } from '../controller/user.controller.js'
import { verifyJwt } from '../middleware/auth.middleware.js'


const router = Router()

router.route('/register').post(upload.fields([
    {
   name:"avatar",
   maxCount:1
},
{
    name:"coverImage",
    maxCount:1
}
]),registerUser)

router.route('/login').post(loginUser)
router.route('/logout').post(verifyJwt,logOut)
router.route('/refreshAccessToken').post(refreshAccessToken)
router.route('/update-details').patch(verifyJwt,updatUserDetails)
router.route('/updateAvatar').patch(verifyJwt,upload.single("avatar"),updateAvatar)
router.route('/updateCoverImage').patch(verifyJwt,upload.single("coverImage"),updateCoverImage)
router.route('/updatePassword').patch(verifyJwt,updatePassword)
router.route('/getUserDetails/:userName').get(verifyJwt,getUserDetails)

export default router