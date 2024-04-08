import { Router } from "express"
import {
    upFile,
    getFile,
    getAttacheds,
    delFile,
} from "../controllers/transferencia_adjuntos.controller.js"
import fileUpload from 'express-fileupload'

const router = Router()

router.post("/file/:IdDetalleTranslado", fileUpload(), upFile)
router.get("/getFile/:IdAdjunto", getFile)
router.get("/delFile/:IdAdjunto", delFile)
router.get("/files/:IdDetalleTranslado", getAttacheds)

export default router