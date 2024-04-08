import {sequelize} from "../database/database.js";
import {QueryTypes, where} from "sequelize";
import {LISTAR_DETALLE_DESPACHO_SOLICITUD} from "../database/queries/detalle-despacho-solicitud.js";
import {DetalleDespachoSolicitud} from "../models/DetalleDespachoSolicitud.js";

class DetalleDespachoSolicitudArticuloRepository {
    static listarDetalleDespachoSolicitud = async (id_despacho, tipo, IdEmpresa, IdAlmacenes) => {
        tipo = tipo === 'DESPACHO' ? 'ENTREGA' : tipo
        return sequelize.query(LISTAR_DETALLE_DESPACHO_SOLICITUD, {
            replacements: {id_despacho, tipo, IdEmpresa, IdAlmacenes},
            type: QueryTypes.SELECT
        })
    }
    static update = async (params = {}, where = {}, transaction) => {
        return DetalleDespachoSolicitud.update(params, {
            where,
            transaction
        })
    }
    static listar = async (id_despacho, transaction) => {
        return DetalleDespachoSolicitud.findAll({
            where: {
                IdDespacho: id_despacho
            }
        })
    }
}

export default DetalleDespachoSolicitudArticuloRepository