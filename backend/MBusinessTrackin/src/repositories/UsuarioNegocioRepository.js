import {LISTAR_POR_ID_SOLICITUD} from "../database/queries/usuario-negocio.js";
import {LISTAR_POR_ID_SOLICITUD_TRANSFERENCIA} from "../database/queries/usuario-negocio-transferencia.js";

import {UsuarioNegocio} from "../models/UsuarioNegocio.js";
import {sequelize} from "../database/database.js";
import {QueryTypes} from "sequelize";

class UsuarioNegocioRepository {
    static listarPorId = (id) => {
        return sequelize.query(LISTAR_POR_ID_SOLICITUD, {
            replacements: { id_solicitud: id },
            type: QueryTypes.SELECT
        })
    }

    static buscarPorIdNegocio = (IdNegocio) => {
        return UsuarioNegocio.findAll({
            where: {
                IdNegocio
            },
            raw: true
        })
    }

    static listarUsuarioTransferenciaPorId = (id) => {
        return sequelize.query(LISTAR_POR_ID_SOLICITUD_TRANSFERENCIA, {
            replacements: { id_solicitud: id },
            type: QueryTypes.SELECT
        })
    }
}

export default UsuarioNegocioRepository