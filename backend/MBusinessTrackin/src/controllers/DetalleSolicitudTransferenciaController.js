import DetalleSolicitudTransferenciaRepository from "../repositories/DetalleSolicitudTransferenciaRepository.js";
import UsuarioAlmacenRepository from "../repositories/UsuarioAlmacenRepository.js";
import BaseController from "./BaseController.js";

class DetalleSolicitudTransferenciaController extends BaseController {

    // DETALLE DE MODAL DE SOLICITUD DE ARTICULO
    static listarDetallePorSolicitudTransferencia = async (req, res) => {
        try {
            const {user, company} = req.headers
            const {id_solicitud} = req.params
            const almacenes = await UsuarioAlmacenRepository.listarPorId(user.id_user)
            const IdAlmacenes = almacenes.map(almacen => almacen.id)
            const data = await DetalleSolicitudTransferenciaRepository.listarPorIdSolicitud(id_solicitud, company.id, IdAlmacenes)
            return this.successResponse(res, data)
        } catch (e) {
            return this.errorResponse(res, e)
        }
    }

}

export default DetalleSolicitudTransferenciaController