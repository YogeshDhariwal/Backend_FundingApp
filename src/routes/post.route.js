import Router from 'express'
import { verifyJwt } from '../middleware/auth.middleware.js'
import { upload } from '../middleware/multer.middleware.js'
import { deletePostedMessage, deletePostedVideo, getAllPosts, postMessage, postVideo } from '../controller/post.controller.js'

const router =Router()

router.use(verifyJwt)

router.route('/postVideo').post(upload.fields([
  {
    name:"video"
  }
]),postVideo)

router.route('/postMessage').post(postMessage)
router.route('/getAllPosts').get(getAllPosts)
router.route('/deletePostedVideo/:postVideoId').delete(deletePostedVideo)
router.route('/deletePostedMessage/:postedMessageId').delete(deletePostedMessage)

  export default router