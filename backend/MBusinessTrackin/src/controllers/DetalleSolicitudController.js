import DetalleSolicitudArticuloRepository from "../repositories/DetalleSolicitudArticuloRepository.js";
import UsuarioAlmacenRepository from "../repositories/UsuarioAlmacenRepository.js";
import BaseController from "./BaseController.js";

class DetalleSolicitudController extends BaseController {

    // DETALLE DE MODAL DE SOLICITUD DE ARTICULO
    static listarDetallePorSolicitud = async (req, res) => {
        try {
            const {user, company} = req.headers
            const {id_solicitud} = req.params
            const almacenes = await UsuarioAlmacenRepository.listarPorId(user.id_user)
            const IdAlmacenes = almacenes.map(almacen => almacen.id)
            const data = await DetalleSolicitudArticuloRepository.listarPorIdSolicitud(id_solicitud, company.id, IdAlmacenes)
            return this.successResponse(res, data)
        } catch (e) {
            return this.errorResponse(res, e)
        }
    }

    static listarDetalleDevolucionPorSolicitud = async (req, res) => {
        try {
            const {user, company} = req.headers
            const {id_solicitud} = req.params
            const almacenes = await UsuarioAlmacenRepository.listarPorId(user.id_user)
            const IdAlmacenes = almacenes.map(almacen => almacen.id)
            const data = await DetalleSolicitudArticuloRepository.listarDevolucionPorIdSolicitud(id_solicitud, company.id, IdAlmacenes)
            return this.successResponse(res, data)
        } catch (e) {
            return this.errorResponse(res, e)
        }
    }
}

export default DetalleSolicitudController