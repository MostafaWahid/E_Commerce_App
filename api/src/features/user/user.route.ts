import express from 'express'
import { getUserProfile } from './controllers/user.controller'


const router=express.Router()




router.get('/me',getUserProfile)

export default router