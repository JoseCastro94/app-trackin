import Sequelize, {QueryTypes, Op} from "sequelize";
import {sequelize} from "../database/database.js";
import {TransacAlmacen} from "../models/TransacAlmacen.js";
import {BUSCAR_STOCK} from "../database/queries/transac-almacen.js";

class TransacAlmacenRepository {
    static buscarStock = async (idDetalleSolicitud, idArticulo, idAlmacen, idNegocio, tipo, transaction) => {
        return sequelize.query(BUSCAR_STOCK, {
            transaction,
            replacements: {
                idDetalleSolicitud,
                idArticulo,
                idAlmacen,
                idNegocio,
                tipo
            },
            type: QueryTypes.SELECT,
            plain: true
        })
    }

    static buscarUltimoComprometido = async (params) => {
        const {IdDetalleSolicitud, IdArticulo, IdNegocio, IdAlmacenOrigen, Tipo} = params
        return TransacAlmacen.findOne({
            attributes: [
                'IdTipoTransac',
                'ItemCode',
                'ItemName',
                'Nombre_GrupArt',
                'U_Devolicion',
                'Cantidad',
                'IdEmpresa',
                'IdAlmacenOrigen',
                'IdArticulo',
                'IdNegocio',
                'IdDetalleSolicitud'
            ],
            where: {
                IdDetalleSolicitud,
                IdArticulo,
                IdNegocio,
                IdAlmacenOrigen,
                Tipo
            },
            order: [['FechaCreacion', 'DESC']]
        }).then(data => {
            console.log('DATA-TRANSAC')
            return data.toJSON()
        })
    }

    static getCantidad = async (params) => {
        const {IdDetalleSolicitud, IdArticulo, IdNegocio, IdAlmacenOrigen, Tipo} = params
        return TransacAlmacen.findOne({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('Cantidad')), 'cantidad'],
            ],
            where: {
                IdDetalleSolicitud,
                IdArticulo,
                IdNegocio,
                IdAlmacenOrigen,
                Tipo
            },
            group: ['IdDetalleSolicitud'],
            raw: true
        }).then(data => data && data.cantidad? Math.abs(data.cantidad) : 0 )
    }

    static create = async (params, transaction) => {
        return TransacAlmacen.bulkCreate(params, { transaction })
    }

    static findByIdDetalleDespacho = async (idDetalleDespacho) => {
        return TransacAlmacen.findAll({
            where: {
                IdDetalleDespacho: {[Op.in]: idDetalleDespacho},
                Tipo: 'PICKPACK',
                IdTipoTransac: 'DESP'
            },
            raw: true
        })
    }
}

export default TransacAlmacenRepository