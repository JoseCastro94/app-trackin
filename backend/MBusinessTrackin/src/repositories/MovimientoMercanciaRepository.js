import {MovimientoMercancia} from "../models/MovimientoMercancia.js";
import {DetalleMovimientoMercancia} from "../models/DetalleMovimientoMercancia.js";
import {Parametro} from "../models/Parametro.js";
import {Almacen} from "../models/Almacen.js";
import Sequelize, {Op} from "sequelize";
import {Articulo} from "../models/Articulo.js";
import {TipoNegocio} from "../models/TipoNegocio.js";
import {ControlSerie} from "../models/ControlSerie.js";
import {Stock} from "../models/Stock.js";

class MovimientoMercanciaRepository {
    static getCodigo = async (transaction) => {
        return MovimientoMercancia.findOne({
            attributes: [
                [Sequelize.fn('CONCAT',
                    'ING-',
                    Sequelize.fn('YEAR', Sequelize.literal('NOW()')), '-',
                    Sequelize.fn('LPAD', Sequelize.literal('COUNT(IdEntradaMercancia) + 1'), 6, '0')
                ), 'codigo']
            ],
            where: {
                date: Sequelize.where(
                    Sequelize.fn('YEAR', Sequelize.col('FechaCreacion')),
                    Sequelize.fn('YEAR', Sequelize.literal('NOW()')))
            },
            raw: true,
            transaction
        }).then(data => data.codigo)
    }

    static list = async (fecha_ini, fecha_fin, IdEmpresa, IdAlmacenes) => {
        return MovimientoMercancia.findAll({
            attributes: [
                ["IdEntradaMercancia", 'id'],
                ["Codigo", 'codigo'],
                ["DocReference", 'num_doc'],
                [Sequelize.fn('date_format', Sequelize.col('MovimientoMercancia.FechaCreacion'), '%d/%m/%Y'), 'fecha'],
                [Sequelize.fn('time', Sequelize.col('MovimientoMercancia.FechaCreacion')), 'hora'],
                [Sequelize.col('Tipo.Nombre'), 'tipo'],
                [Sequelize.col('TipoDoc.Nombre'), 'documento'],
                [Sequelize.col('Almacene.Nombre'), 'almacen'],
                [Sequelize.literal(`(select Nombres from Usuarios where NroDocumento = MovimientoMercancia.UsuarioCreacion)`), 'usuario']
            ],
            where: {
                date: Sequelize.where(
                    Sequelize.fn('DATE', Sequelize.col('MovimientoMercancia.FechaCreacion')),
                    {
                        [Op.between]: [fecha_ini, fecha_fin]
                    }),
                IdEmpresa,
                IdAlmacen: { [Op.in]: IdAlmacenes }
            },
            order: [
                ['FechaCreacion', 'DESC'],
                [DetalleMovimientoMercancia, 'ItemName', 'ASC'],
                [DetalleMovimientoMercancia, 'SerialNumber', 'ASC']
            ],
            include: [
                {
                    model: Parametro,
                    attributes: [
                        ['IdParametro', 'id'],
                        ['Nombre', 'nombre'],
                    ],
                    as: 'Tipo',
                    required: true
                },
                {
                    model: Parametro,
                    attributes: [
                        ['IdParametro', 'id'],
                        ['Nombre', 'nombre'],
                    ],
                    as: 'TipoDoc',
                    required: true
                },
                {
                    model: Almacen,
                    attributes: [
                        ['IdAlmacen', 'id'],
                        ['Nombre', 'nombre'],
                    ],
                    required: true
                },
                {
                    model: DetalleMovimientoMercancia,
                    attributes: [
                        ['IdDetalleMercancia', 'id'],
                        ['ItemName', 'descripcion'],
                        ['Cantidad', 'cantidad'],
                        ['Observacion', 'comentario'],
                        ['Categoria', 'categoria'],
                        ['Almacen', 'almacen'],
                        ['SerialNumber', 'serie'],
                    ],
                    include: [
                        {
                            model: TipoNegocio,
                            attributes: [
                                ['Nombre', 'cuenta'],
                                ['IdNegocio', 'id']
                            ]
                        },
                        {
                            model: Articulo,
                            attributes: [
                                ['IdArticulo', 'id'],
                                ['ItemCode', 'codigo']
                            ]
                        }
                    ],
                    raw: true
                }
            ]
        }).then(data => JSON.stringify(data)).then(data => JSON.parse(data))
    }

    static create = async (params, transaction) => {
        return MovimientoMercancia.create(params, {
            include: [DetalleMovimientoMercancia, ControlSerie],
            transaction
        })
    }

    static bulkCreate = async (params, transaction) => {
        return MovimientoMercancia.bulkCreate(params, {
            include: [DetalleMovimientoMercancia, ControlSerie],
            transaction
        })
    }
}

export default MovimientoMercanciaRepository
