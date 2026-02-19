import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { getBasicSubscription } from "../controller/membership.controller.js";

const router =Router()

router.use(verifyJwt)

router.route('/getBasicPlan').post(upload.fields([
    {
       name:"videos",
       maxCount:10
    }
]),getBasicSubscription)

export  default router