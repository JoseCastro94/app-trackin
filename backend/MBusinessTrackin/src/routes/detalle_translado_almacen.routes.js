import { Router } from "express"
import {
    getList,
} from "../controllers/detalle_translado_almacen.controller.js"

const router = Router()

router.get("/List/:IdTranslado", getList)

export default router