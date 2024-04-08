import { Router } from "express"
import {
    upFile,
    getFile,
    getAttacheds,
    delFile,
} from "../controllers/relevo_adjunto.controller.js"
import fileUpload from 'express-fileupload'

const router = Router()

router.post("/file/:IdRelevoAlmacen", fileUpload(), upFile)
router.get("/getFile/:IdAdjunto", getFile)
router.get("/delFile/:IdAdjunto", delFile)
router.get("/files/:IdRelevoAlmacen", getAttacheds)

export default router