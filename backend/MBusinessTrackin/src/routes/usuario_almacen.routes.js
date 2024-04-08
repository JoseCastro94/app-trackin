import { Router } from "express"
import {
    createUsuarioAlmacen,
    getUsuarioAlmacenes,
    updUsuarioAlmacen,
} from "../controllers/usuario_almacen.controller.js"

const router = Router()

router.post("/", createUsuarioAlmacen)
router.post("/updUsuarioAlmacen", updUsuarioAlmacen)
router.get("/", getUsuarioAlmacenes)

export default router