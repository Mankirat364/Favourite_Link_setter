import express from 'express'
import { Router } from 'express'
import {googleAuth , googleCallback,logout} from '../controllers/googleUserController.js'
import passport from 'passport';
const router = express.Router();
router.get('/google',googleAuth)

router.get('/google/callback', passport.authenticate("google", {failureRedirect : '/login'}), googleCallback)

router.get('/logout', logout)

export default router
