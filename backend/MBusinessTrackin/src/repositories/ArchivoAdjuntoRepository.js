import {ArchivoAdjunto} from "../models/ArchivoAdjunto.js";

class ArchivoAdjuntoRepository {
    static findById = async (id) => {
        return ArchivoAdjunto.findByPk(id)
    }

    static listar = async (Modulo, IdModulo) => {
        return ArchivoAdjunto.findAll({
            where: {
                Modulo,
                IdModulo
            },
            raw: true
        })
    }

    static create = async (params, transaction) => {
        return ArchivoAdjunto.create(params, { transaction })
    }

    static destroy = async (IdArchivo) => {
        return ArchivoAdjunto.destroy({
            where: {
                IdArchivo
            },
        })
    }
}

export default ArchivoAdjuntoRepository
