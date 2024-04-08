import { Router } from "express"
import {
    createSolicitudArticulo,
    getSolicitudArticulos,
    getSolicitudesArticulosInfo,
    getSolicitudArticulosInfo,
    updSolicitudArticulo,
    getConteoUsuario,
    getSolicitudesArticulosActivo,
    getSolicitudesArticulosHistorico,
    getTrackSolicitud,
    insDevolucion,
    loadFromFile,
    getDataDetail,
    createSolicitudTransferencia
} from "../controllers/solicitud_articulo.controller.js"
import DetalleSolicitudController from "../controllers/DetalleSolicitudController.js"
import DetalleSolicitudTransferenciaController from "../controllers/DetalleSolicitudTransferenciaController.js"
import fileUpload from "express-fileupload"

const router = Router()

router.post("/", createSolicitudArticulo)
router.post("/createSolicitudTransferencia", createSolicitudTransferencia)
router.post("/Devolucion", insDevolucion)

router.get("/", getSolicitudArticulos)
router.get("/DataUpload", getDataDetail)
router.get("/ConteoUsuario", getConteoUsuario('8e0ed3d9-435c-49b1-a67e-31052e08f912'))
router.get("/ConteoDevolucionUsuario", getConteoUsuario('fa7dc607-8e72-4644-ba00-962e2df265d2'))
router.get("/SolicitudesArticulosInfo", getSolicitudesArticulosInfo)

router.get("/SolicitudesArticulosActivo", getSolicitudesArticulosActivo('PEDIDO', [
    '4d43c52b-7858-4156-a537-d41d092c3399',
    '217aeef5-2957-4a87-bfa8-8a6e65ed0737',
]))

router.get("/SolicitudesArticulosHistorico", getSolicitudesArticulosHistorico('PEDIDO', [
    '4d43c52b-7858-4156-a537-d41d092c3399',
    '217aeef5-2957-4a87-bfa8-8a6e65ed0737',
]))

router.get("/DevolucionArticulosActivo", getSolicitudesArticulosActivo('DEVOLUCION', [
    'ff7535f6-3274-4ab8-9974-5a45109048db',
    'ff7535f6-3274-4ab8-9975-5a45109048db',
]))

router.get("/DevolucionArticulosHistorico", getSolicitudesArticulosHistorico('DEVOLUCION', [
    'ff7535f6-3274-4ab8-9974-5a45109048db',
    'ff7535f6-3274-4ab8-9975-5a45109048db',
]))

router.get("/SolicitudArticulosInfo/:IdSocilitud", getSolicitudArticulosInfo)

router.get("/TrackSolicitud/:IdSocilitud", getTrackSolicitud({
    para_pendiente: '1ba55dc8-3d0a-4c09-933e-7b5aabc70d60',
    para_proceso: '3f2eae4c-11e9-4edf-86f7-04f6bb6fddf6',
    para_entregado: '4d43c52b-7858-4156-a537-d41d092c3399',
    para_cancelado: '217aeef5-2957-4a87-bfa8-8a6e65ed0737',
}))

router.get("/TrackDevolucion/:IdSocilitud", getTrackSolicitud({
    para_pendiente: 'ff7535f6-3274-4ab8-9972-5a45109048db',
    para_proceso: 'ff7535f6-3274-4ab8-9976-5a45109048db',
    para_entregado: 'ff7535f6-3274-4ab8-9975-5a45109048db',
    para_cancelado: 'ff7535f6-3274-4ab8-9974-5a45109048db',
}))

router.patch("/SolicitudArticulo/:IdSocilitud", updSolicitudArticulo)
router.get("/:id_solicitud/detalle-solicitud", DetalleSolicitudController.listarDetallePorSolicitud)
router.get("/:id_solicitud/detalle-devolucion", DetalleSolicitudController.listarDetalleDevolucionPorSolicitud)
router.get("/:id_solicitud/detalle-solicitud-transferencia", DetalleSolicitudTransferenciaController.listarDetallePorSolicitudTransferencia)


router.post("/loadFromFile", fileUpload(), loadFromFile)

export default router