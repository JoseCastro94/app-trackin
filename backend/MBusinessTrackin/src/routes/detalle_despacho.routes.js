import { Router } from "express"
import {
    getDetalleDespachoEntregado,
    getEntregado,
} from "../controllers/detalle_despacho.controller.js"

const router = Router()

router.get("/DetalleDespachoEntregado", getDetalleDespachoEntregado)
router.post("/getEntregado/:IdUsuario", getEntregado)

export default router