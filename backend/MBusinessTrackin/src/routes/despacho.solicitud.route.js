import {Router} from "express"
import DespachoSolicitudController from "../controllers/DespachoSolicitudController.js";
import {
    findOne
} from '../controllers/despacho_solicitud.controller.js'
const router = Router()

router.get("/", DespachoSolicitudController.listar)
router.get("/:id_despacho/detalle", DespachoSolicitudController.listarDetalle)
router.post("/", DespachoSolicitudController.create)
router.post("/devolucion", DespachoSolicitudController.createDevolucion)
router.post("/findOne", findOne)

export default router;