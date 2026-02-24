import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { getMembership, upgradePlan, cancelMembership } from "../controller/membership.controller.js";

const router = Router()

router.use(verifyJwt)

router.route('/current').get(getMembership)
router.route('/upgrade').post(upgradePlan)
router.route('/cancel').post(cancelMembership)

export default router