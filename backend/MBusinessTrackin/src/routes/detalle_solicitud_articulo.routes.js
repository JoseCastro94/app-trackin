import { Router } from "express"
import {
    getDetalleSolicitudArticulos,
    updCantidad,
    getDetalleSolicitudEntregado,
} from "../controllers/detalle_solicitud.controller.js"

const router = Router()

router.get("/detail/:IdSocilitud", getDetalleSolicitudArticulos)
router.post("/updateCantidad/:IdDetalleSocilitud", updCantidad)
router.post("/getDetalleSolicitudEntregado/:IdUsuario", getDetalleSolicitudEntregado)

export default router