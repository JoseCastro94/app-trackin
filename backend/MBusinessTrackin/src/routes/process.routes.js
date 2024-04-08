import { Router } from "express"
import fileUpload from "express-fileupload"
import {
    article_allocation
} from '../controllers/process.controller.js'

const router = Router()

router.post("/article_allocation", fileUpload(), article_allocation)

export default router