import Router from 'express'
import { verifyJwt } from '../middleware/auth.middleware.js'
import { upload } from '../middleware/multer.middleware.js'
import { deletePostedMessage, deletePostedVideo,
   getAccessiblePosts, getAllPosts,
    postMessage, postVideo } from '../controller/post.controller.js'
import { canAccess } from '../middleware/access.middleware.js'
const router =Router()

router.use(verifyJwt)

router.route('/postVideo').post(upload.fields([
  {
    name:"videoFile"
  }
]),postVideo)

router.route('/postMessage').post(postMessage)
router.route('/getAllPosts').get(getAllPosts)
router.route('/deletePostedVideo/:postVideoId').delete(deletePostedVideo)
router.route('/deletePostedMessage/:postedMessageId').delete(deletePostedMessage)
router.route('/getAllAccessablPost').get(canAccess,getAccessiblePosts)

  export default router