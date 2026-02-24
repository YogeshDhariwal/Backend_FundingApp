import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { createOrder, verifyPayment } from "../controller/payment.controller.js";
const router = Router()
router.use(verifyJwt)

router.route('/createOrder').post(createOrder)
router.route('/verifyPayment').post(verifyPayment)


export default router
