import {request, response, Router} from "express"
import SolicitudArticuloController from "../controllers/SolicitudArticuloController.js";
const router = Router()

router.get('/', SolicitudArticuloController.list)
router.post('/', SolicitudArticuloController.listarSolicitudesConDetalle)
router.get('/devoluciones', SolicitudArticuloController.listarDevoluciones)
router.post('/devoluciones', SolicitudArticuloController.listarDevolucionesConDetalle)
router.get('/estados', SolicitudArticuloController.listarEstados)

export default router;