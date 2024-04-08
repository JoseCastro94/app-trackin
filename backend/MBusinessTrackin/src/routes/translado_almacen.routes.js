import { Router } from "express"
import {
    ins,
    getList,
    upd,
    getStats,
    getOne,
    loadFromFile,
} from "../controllers/translado_almacen.controller.js"
import fileUpload from "express-fileupload"

const router = Router()

router.post("/List", getList)
router.post("/Stats", getStats)
router.post("/getOne", getOne)
router.post("/ins", ins)
router.post("/upd/:IdTranslado", upd)
router.post("/loadFromFile", fileUpload(), loadFromFile)


export default router