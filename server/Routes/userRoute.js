import express from 'express'
import { Router } from 'express'
import { userRegister, userLogin, userLogout, userUpdate, googleUserInfo, getUserToken } from '../controllers/userController.js';

const router = express.Router();

router.post('/register',userRegister)
router.post('/login',userLogin)
router.delete('/logout',userLogout)
router.put('/update/:userId',userUpdate)
router.get('/me',googleUserInfo)
router.get('/getToken',getUserToken )

export default router
