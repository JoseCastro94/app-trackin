import { DespachoSolicitud } from '../models/DespachoSolicitud.js'
import { DetalleDespachoSolicitud } from '../models/DetalleDespachoSolicitud.js'
import { DetalleSolicitudArticulo } from '../models/DetalleSolicitudArticulo.js'
import { Usuario } from '../models/Usuario.js'
import { ArticuloNegocio } from '../models/ArticuloNegocio.js'
import { TipoNegocio } from '../models/TipoNegocio.js'
import { Almacen } from '../models/Almacen.js'
import { Articulo } from '../models/Articulo.js'
import { GrupoArticulo } from '../models/GrupoArticulo.js'
import Sequelize, { Op } from "sequelize"

import { DETALLE_DESPACHO } from '../storage/const.js'
import { SolicitudArticulo } from '../models/SolicitudArticulo.js'

export const getDetalleDespachoEntregado = async (req, res) => {
    const { company } = req.headers
    const id_empresa_activo = company.id

    try {
        const detalle = await DetalleDespachoSolicitud.findAll({
            attributes: [
                "IdDetalleDespacho",
                "ItemCode",
                "ItemName",
                [Sequelize.col('DetalleSolicitudArticulo.Asignado.ApellidoPaterno'), "ApellidoPaterno"],
                [Sequelize.col('DetalleSolicitudArticulo.Asignado.ApellidoMaterno'), "ApellidoMaterno"],
                [Sequelize.col('DetalleSolicitudArticulo.Asignado.Nombres'), "Nombres"],
                [Sequelize.col('DetalleSolicitudArticulo.ArticuloNegocio.TipoNegocio.Nombre'), "Negocio"],
                [Sequelize.col('DetalleSolicitudArticulo.FechaCreacion'), "FechaCreacion"],
                ["CantidadEntrega", "Cantidad"],
                ["SerialNumber", "SerialNumber"],
                ["EstadoEvaluado", "EstadoEvaluado"],
            ],
            include: {
                model: DetalleSolicitudArticulo,
                attributes: [],
                include: [
                    {
                        model: Usuario,
                        attributes: [],
                        as: 'Asignado'
                    },
                    {
                        model: ArticuloNegocio,
                        attributes: [],
                        include: [{
                            model: TipoNegocio,
                            attributes: [],
                            required: true,
                        }, {
                            model: Articulo,
                            attributes: [],
                            required: true,
                            include: {
                                model: GrupoArticulo,
                                required: true,
                                where: {
                                    U_Evaluacion: 'Y'
                                },
                                required: true,
                            }
                        }],
                        required: true
                    },
                    {
                        model: SolicitudArticulo,
                        attributes: [],
                        where: {
                            IdEmpresa: id_empresa_activo,
                            Tipo: 'DEVOLUCION'
                        },
                        required: true
                    }
                ],
                required: true,
            },
            where: {
                IdEstadoEntrega: {
                    [Op.in]: [
                        DETALLE_DESPACHO.ENTREGADO,
                        DETALLE_DESPACHO.ENTREGA_PARCIAL
                    ]
                }
            },
            order: [['FechaCreacion', 'DESC']],
        })
        res.json(detalle)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const getEntregado = async (req, res) => {
    try {
        const {
            IdUsuario
        } = req.params

        const detalle = await DespachoSolicitud.findAll({
            attributes: [
                [Sequelize.col("DetalleDespachoSolicituds.IdDetalleDespacho"), "id"],
                [Sequelize.col("DetalleDespachoSolicituds.ItemCode"), "CodArticulo"],
                [Sequelize.col("DetalleDespachoSolicituds.ItemName"), "Articulo"],
                [Sequelize.col("DetalleDespachoSolicituds.SerialNumber"), "SerialNumber"],
                [Sequelize.col("DetalleDespachoSolicituds.PendienteDevolver"), "Cantidad"],
                [Sequelize.col("DetalleDespachoSolicituds.DetalleSolicitudArticulo.IdArticuloNegocio"), "IdArticuloNegocio"],
                [Sequelize.col("DetalleDespachoSolicituds.DetalleSolicitudArticulo.IdUsuarioNegocio"), "IdUsuarioNegocio"],
                ["IdAsignado", "IdUsuario"],
                [Sequelize.col("DetalleDespachoSolicituds.DetalleSolicitudArticulo.IdNegocio"), "IdNegocio"],
                [Sequelize.col("DetalleDespachoSolicituds.DetalleSolicitudArticulo.CCosto"), "CCosto"],
                [Sequelize.col("DetalleDespachoSolicituds.DetalleSolicitudArticulo.CodigoCCosto"), "CodigoCCosto"],
                [Sequelize.col("DetalleDespachoSolicituds.DetalleSolicitudArticulo.U_BPP_TIPUNMED"), "U_BPP_TIPUNMED"],
                [Sequelize.col("DetalleDespachoSolicituds.DetalleSolicitudArticulo.U_BPP_DEVOL"), "U_BPP_DEVOL"],
                [Sequelize.col("DetalleDespachoSolicituds.DetalleSolicitudArticulo.U_MSSL_GRPART"), "U_MSSL_GRPART"],
                [Sequelize.col("DetalleDespachoSolicituds.DetalleSolicitudArticulo.IdAlmacen"), "IdAlmacen"],
                [Sequelize.col("DetalleDespachoSolicituds.DetalleSolicitudArticulo.ArticuloNegocio.Articulo.IdArticulo"), "IdArticulo"],
                [Sequelize.col("DetalleDespachoSolicituds.DetalleSolicitudArticulo.ArticuloNegocio.Articulo.GrupoArticulo.U_Devolucion"), "U_Devolucion"],
                [Sequelize.col("DetalleDespachoSolicituds.PendienteDevolver"), "CantidadDevuelto"],
                [Sequelize.col("DetalleDespachoSolicituds.DetalleSolicitudArticulo.Almacene.Nombre"), "Almacen"],
                [Sequelize.col("DetalleDespachoSolicituds.FechaModifica"), "FechaCreacion"],
            ],
            where: {
                IdAsignado: IdUsuario,
                Tipo: 'DESPACHO'
            },
            include: [
                {
                    attributes: [],
                    model: DetalleDespachoSolicitud,
                    where: {
                        PendienteDevolver: {
                            [Op.gt]: 0
                        },
                        IdEstadoEntrega: DETALLE_DESPACHO.ENTREGADO
                    },
                    include: {
                        attributes: [],
                        model: DetalleSolicitudArticulo,
                        include: [
                            {
                                attributes: [],
                                model: ArticuloNegocio,
                                include: {
                                    attributes: [],
                                    model: Articulo,
                                    include: {
                                        attributes: [],
                                        model: GrupoArticulo,
                                    }
                                },
                            },
                            {
                                attributes: [],
                                model: Almacen,
                            }
                        ],
                    }
                }
            ],
            raw: true,
            order: [[Sequelize.col("DetalleDespachoSolicituds.ItemName"), 'ASC']],
        })
        res.json(detalle)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}