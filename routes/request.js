import { Router } from 'express'
import {createRequest} from '../controllers/request.js'
import { checkAuth } from '../utils/checkAuth.js'
const router = new Router()

// Create Request By Id
// http://localhost:3002/api/request/:id
router.post('/:id', checkAuth, createRequest);
//
// // Get All Request By Post
// // http://localhost:3002/api/posts/:id
// router.post('/:id', checkAuth, getAllRequestsForPost)
export default router
