import { Router } from 'express'
const router = Router()

import { verifyToken } from '../middlewares/authJwt.js'
import {
    lab
} from '../controllers/lab.controller.js'

router.get("/lab", lab)

export default router