import { Router } from "express"
import {
    upFile,
    getFile,
} from "../controllers/evaluacion_adjunto.controller.js"
import fileUpload from 'express-fileupload'

const router = Router()

router.post("/file", fileUpload(), upFile)
router.get("/getFile/:IdAdjunto", getFile)

export default router