import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";

import { getSubscription } from "../controller/membership.controller.js";

const router =Router()

router.use(verifyJwt)

router.route('/getAnyPlan').post(getSubscription)

export  default router