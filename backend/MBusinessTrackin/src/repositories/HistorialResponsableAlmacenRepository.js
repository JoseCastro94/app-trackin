import {HistorialResponsableAlmacen} from "../models/HistorialResponsableAlmacen.js";
import Sequelize, {Op} from "sequelize";
import {DetalleHistorialResponsableAlmacen} from "../models/DetalleHistorialResponsableAlmacen.js";

class HistorialResponsableAlmacenRepository {
    static getCodigo = async () => {
        return HistorialResponsableAlmacen.findOne({
            attributes: [
                [Sequelize.fn('CONCAT',
                    `HRA-`,
                    Sequelize.fn('YEAR', Sequelize.literal('NOW()')), '-',
                    Sequelize.fn('LPAD', Sequelize.literal('COUNT(IdHistRespoAlmacen) + 1'), 6, '0')
                ), 'codigo']
            ],
            where: {
                date: Sequelize.where(
                    Sequelize.fn('YEAR', Sequelize.col('FechaCreacion')),
                    Sequelize.fn('YEAR', Sequelize.literal('NOW()')))
            },
            raw: true
        }).then(data => data.codigo)
    }

    static list = async () => {
        return HistorialResponsableAlmacen.findAll({
            attributes: [
                ['IdHistRespoAlmacen', 'id'],
                ['Codigo', 'codigo'],
                ['DniResponsableIngresa', 'documento'],
                [Sequelize.fn('DATE_FORMAT', Sequelize.col('FechaInicioResp'), '%d/%m/%Y'), 'fecha_ini'],
                [Sequelize.fn('DATE_FORMAT', Sequelize.col('FechaFinResp'), '%d/%m/%Y'), 'fecha_fin'],
                ['Estado', 'estado'],
                ['Email', 'email'],
            ],
            order: [['FechaCreacion', 'DESC']],
            raw: true
        })
    }

    static create = async (data, transaction) => {
        return HistorialResponsableAlmacen.create(data, {
            include: [
                DetalleHistorialResponsableAlmacen
            ],
            transaction
        })
    }
}

export default HistorialResponsableAlmacenRepository