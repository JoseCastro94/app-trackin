import { Router } from "express"
import {
    upFile,
    getFile,
    getAttacheds,
} from "../controllers/incidente_adjunto.controller.js"
import fileUpload from 'express-fileupload'

const router = Router()

router.post("/file", fileUpload(), upFile)
router.get("/getFile/:IdAdjunto", getFile)
router.get("/files/:IdIncidente", getAttacheds)

export default router