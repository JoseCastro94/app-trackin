import {request, response, Router} from "express"
import SolicitudTransferenciaController from "../controllers/SolicitudTransferenciaController.js";
import DetalleSolicitudTransferenciaController from "../controllers/DetalleSolicitudTransferenciaController.js"
const router = Router()


router.get('/', SolicitudTransferenciaController.list)
router.post('/', SolicitudTransferenciaController.listarSolicitudesConDetalle)
router.post('/aprobarPendienteAprobacion', SolicitudTransferenciaController.aprobarPendienteAprobacion)
router.get('/estados', SolicitudTransferenciaController.listarEstados)
router.delete('/rechazar', SolicitudTransferenciaController.rechazarSolicitud)
router.get("/:id_solicitud/detalle-solicitud-transferencia", DetalleSolicitudTransferenciaController.listarDetallePorSolicitudTransferencia)


export default router;