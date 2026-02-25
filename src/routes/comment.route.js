import Router from 'express'
import { verifyJwt } from '../middleware/auth.middleware.js'
import { commentOnPost, getCommentPost } from '../controller/comment.controller.js'
const router =Router()

router.use(verifyJwt)

router.route('/commentOnPost/:postId').post(commentOnPost)
router.route('/getCommentPost/:userId').post(getCommentPost)


export default router