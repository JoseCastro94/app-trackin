import {ControlSerie} from "../models/ControlSerie.js";
import {Articulo} from "../models/Articulo.js";
import Sequelize, {Op} from "sequelize";

class ControlSerieRepository {
    static list = async (IdAlmacen, IdNegocio, IdArticulo, series) => {
        const IdEstado = 'f80a2e96-3b92-4a20-a3d2-fc2db9d137fb'
        return ControlSerie.findAll({
            attributes: [
                [Sequelize.col('Articulo.ItemCode'), 'code'],
                [Sequelize.col('Articulo.ItemName'), 'name'],
                ['IdControlSerie', 'id'],
                ['SerialNumber', 'serie']
            ],
            include: [
                {
                    model: Articulo,
                    attributes: [],
                    required: true,
                }
            ],
            where: {
                IdEstado,
                IdAlmacen,
                IdNegocio,
                IdArticulo,
                SerialNumber: {[Op.notIn]: series}
            }
        })
    }

    static findBySeries = async (series) => {
        const IdEstado = 'f80a2e96-3b92-4a20-a3d2-fc2db9d137fb'
        return ControlSerie.findAll({
            attributes: [
                ['IdControlSerie', 'id'],
                ['SerialNumber', 'serie']
            ],
            where: {
                SerialNumber: {[Op.in]: series},
                IdEstado: {[Op.ne]: IdEstado}
            },
            raw: true
        })
    }

    static findSeriesExistentes = async (series) => {
        return ControlSerie.findAll({
            attributes: [
                ['SerialNumber', 'serie']
            ],
            where: Sequelize.where(
                Sequelize.fn('CONCAT', Sequelize.col('SerialNumber'), '|', Sequelize.col('IdArticulo')),
                {[Op.in]: series}
            ),
            raw: true
        })
    }

    static findSeriesExistentesBySerieAndItemCode = async (series) => {
        return ControlSerie.findAll({
            attributes: [
                ['SerialNumber', 'serie'],
                [Sequelize.col('Articulo.ItemCode'), 'codigo'],
            ],
            include: {
                model: Articulo,
                attributes: [],
                required: true
            },
            where: Sequelize.where(
                Sequelize.fn('CONCAT', Sequelize.col('SerialNumber'), '|', Sequelize.col('Articulo.ItemCode')),
                {[Op.in]: series}
            ),
            raw: true
        })
    }

    static bulkCreate = async (params, transaction) => {
        return ControlSerie.bulkCreate(params, { transaction })
    }

    static update = async (params = {}, where = {}, transaction) => {
        return ControlSerie.update(params, {
            where,
            transaction
        })
    }
}

export default ControlSerieRepository