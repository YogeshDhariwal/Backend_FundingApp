import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { getAllLikedPosts, toggleLikeComment, toggleLikePost } from "../controller/like.controller.js";

const router =Router()
router.use(verifyJwt)

router.route('/likePost/toggle/:postId').post(toggleLikePost)
router.route('/likeComment/toggle/:commentId').post(toggleLikeComment)
router.route('/getAllLikedPosts').get(getAllLikedPosts)


export default router
