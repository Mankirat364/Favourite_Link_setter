import express from 'express'
import { createLink, deleteLink, getAllLink, getLink, updateLink } from '../controllers/linkController.js'
import  authMiddleware from '../middleware/authentication.js'

const router = express.Router()

router.post('/createLink', authMiddleware,createLink)
router.get('/link',authMiddleware,getLink)
router.put('/update',authMiddleware,updateLink)
router.delete('/delete/:link_id',authMiddleware,deleteLink)
router.get('/allLink',authMiddleware,getAllLink)
export default router