import { Router } from "express"
import {
    validate,
    isAuthorized,
} from '../controllers/auth.controller.js'

const router = Router()

router.post("/validated", validate)
router.post("/isAuthorized", isAuthorized)

export default router