import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { createOrder } from "../controller/payment.controller.js";
const router = Router()
router.use(verifyJwt)

router.route('/createOrder').post(createOrder)

export default router
