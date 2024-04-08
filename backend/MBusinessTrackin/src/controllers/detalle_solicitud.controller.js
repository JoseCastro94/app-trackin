import { DetalleSolicitudArticulo } from '../models/DetalleSolicitudArticulo.js'
import { Usuario } from '../models/Usuario.js'
import Sequelize, { Op } from "sequelize"
import { Parametro } from '../models/Parametro.js'
import { ArticuloNegocio } from '../models/ArticuloNegocio.js'
import { Articulo } from '../models/Articulo.js'
import { Stock } from '../models/Stock.js'

import { ProcesarStock } from '../operations/stocks.js'
import { GrupoArticulo } from '../models/GrupoArticulo.js'
import { Almacen } from '../models/Almacen.js'
import { EstadoDetalle } from '../models/EstadoDetalle.js'
import { DetalleDespachoSolicitud } from '../models/DetalleDespachoSolicitud.js'

import { ESTADO_DETALLE_SOLICITUD, ESTADO_SOLICITUD } from '../storage/const.js'
import { SolicitudArticulo } from '../models/SolicitudArticulo.js'

//const usuario_activo = "45631343"
//const id_usuario_activo = "36f440fa-7a19-4da7-999e-b5a95789df94"
//const id_empresa_activo = "38d7f59f-5790-4853-afdc-f8bbc0c2eca0"

export const getDetalleSolicitudArticulos = async (req, res) => {
    try {
        const {
            IdSocilitud
        } = req.params

        const detalle = await DetalleSolicitudArticulo.findAll({
            attributes: [
                ["IdDetalleSocilitud", "id"],
                ["ItemCode", "CodArticulo"],
                ["ItemName", "Articulo"],
                ["Cantidad", "Cantidad"],
                [Sequelize.col('Parametro.Nombre'), "Estado"],
                ["FechaCreacion", "FechaCreacion"],
                [Sequelize.col('Asignado.NroDocumento'), "Documento"],
                [Sequelize.fn("SUM", Sequelize.col("DetalleDespachoSolicituds.CantidadEntrega")), "CantidadEntregado"],
            ],
            where: {
                IdSocilitud: IdSocilitud
            },
            include: [
                {
                    model: Usuario,
                    as: 'Asignado',
                    attributes: []
                },
                {
                    model: Parametro,
                    attributes: [],
                },
                {
                    model: DetalleDespachoSolicitud,
                    attributes: [],
                    required: false
                }
            ],
            group: 'IdDetalleSocilitud',
        })
        res.json(detalle)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const updCantidad = async (req, res) => {
    try {
        const { user, company } = req.headers
        const usuario_activo = user.username
        const id_usuario_activo = user.id_user
        const id_empresa_activo = company.id

        const {
            IdDetalleSocilitud
        } = req.params

        const {
            cantidad
        } = req.body

        const findDetail = await DetalleSolicitudArticulo.findOne({
            where: {
                IdDetalleSocilitud: IdDetalleSocilitud
            },
            attributes: [
                "Cantidad",
                "IdAlmacen",
                "IdDetalleSocilitud",
                "IdNegocio",
                "IdEstado",
                "IdSocilitud",
                [Sequelize.col('ArticuloNegocio.IdArticulo'), "IdArticulo"],
                [Sequelize.col('ArticuloNegocio.Articulo.ItemCode'), "ItemCode"],
                [Sequelize.col('ArticuloNegocio.Articulo.ItemName'), "ItemName"],
                [Sequelize.col('ArticuloNegocio.Articulo.GrupoArticulo.U_Devolucion'), "Devolucion"],
                [Sequelize.col('ArticuloNegocio.Articulo.GrupoArticulo.Nombre'), "Grupo"],
            ],
            include: {
                model: ArticuloNegocio,
                attributes: [],
                include: {
                    model: Articulo,
                    attributes: [],
                    include: {
                        model: GrupoArticulo,
                        attributes: []
                    }
                }
            }
        })

        const isClosed = await SolicitudArticulo.findOne({
            where: {
                IdSocilitud: findDetail.IdSocilitud,
                IdEstado: ESTADO_SOLICITUD.CANCELADO
            }
        })

        if (isClosed) {
            res.json({
                status: 'Error',
                message: 'La solicitud se encuentra cerrada'
            })
        } else {
            let detail = findDetail.toJSON()

            const stock = await Stock.findOne({
                where: {
                    IdAlmacen: detail.IdAlmacen,
                    IdNegocio: detail.IdNegocio,
                    IdArticulo: detail.IdArticulo,
                }
            })

            if (stock) {
                let future_stock = detail.Cantidad + stock.Cantidad

                if (future_stock < cantidad) {
                    res.json({
                        status: 'Error',
                        message: 'No hay stock suficiente'
                    })
                } else if (detail.IdEstado !== ESTADO_DETALLE_SOLICITUD.PENDIENTE) {
                    res.json({
                        status: 'Error',
                        message: 'Solo se puede modificar cuando se encuentra en pendiente a programar'
                    })
                } else {
                    await ProcesarStock({
                        IdTipoTransac: 'DEL',
                        Cantidad: detail.Cantidad,
                        Tipo: 'DESCOMPROMETIDO',
                        UsuarioCreacion: usuario_activo,
                        IdUsuario: id_usuario_activo,
                        IdEmpresa: id_empresa_activo,
                        IdAlmacenOrigen: detail.IdAlmacen,
                        IdDetalleSolicitud: detail.IdDetalleSocilitud,
                        IdNegocio: detail.IdNegocio,
                        IdArticulo: detail.IdArticulo,
                        ItemCode: detail.ItemCode,
                        ItemName: detail.ItemName,
                        Devolucion: detail.Devolucion,
                        Grupo: detail.Grupo,
                        TransferStock: 'COMPROMETIDO'
                    })

                    findDetail.Cantidad = cantidad
                    findDetail.UsuarioModifica = usuario_activo
                    findDetail.FechaModifica = new Date()
                    await findDetail.save()

                    await SolicitudArticulo.update({
                        UsuarioModifica: usuario_activo,
                        FechaModifica: new Date()
                    }, {
                        where: {
                            IdSocilitud: findDetail.IdSocilitud
                        }
                    })

                    await ProcesarStock({
                        IdTipoTransac: 'SOL',
                        Cantidad: - cantidad,
                        Tipo: 'COMPROMETIDO',
                        UsuarioCreacion: usuario_activo,
                        IdUsuario: id_usuario_activo,
                        IdEmpresa: id_empresa_activo,
                        IdAlmacenOrigen: detail.IdAlmacen,
                        IdDetalleSolicitud: detail.IdDetalleSocilitud,
                        IdNegocio: detail.IdNegocio,
                        IdArticulo: detail.IdArticulo,
                        ItemCode: detail.ItemCode,
                        ItemName: detail.ItemName,
                        Devolucion: detail.Devolucion,
                        Grupo: detail.Grupo,
                        TransferStock: 'COMPROMETIDO'
                    })
                    res.json({
                        status: 'Ok',
                        message: 'Se actualizó el stock correctamente'
                    })
                }
            } else {
                res.json({
                    status: 'Error',
                    message: 'No se encontro stock'
                })
            }
        }
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: e.message });
    }
}

export const getDetalleSolicitudEntregado = async (req, res) => {
    try {
        const {
            IdUsuario
        } = req.params

        const detalle = await DetalleSolicitudArticulo.findAll({
            attributes: [
                ["IdDetalleSocilitud", "id"],
                ["ItemCode", "CodArticulo"],
                ["ItemName", "Articulo"],
                ["PendienteDevolver", "Cantidad"],
                ["IdArticuloNegocio", "IdArticuloNegocio"],
                ["IdUsuarioNegocio", "IdUsuarioNegocio"],
                ["IdUsuario", "IdUsuario"],
                ["IdNegocio", "IdNegocio"],
                ["CCosto", "CCosto"],
                ["CodigoCCosto", "CodigoCCosto"],
                ["U_BPP_TIPUNMED", "U_BPP_TIPUNMED"],
                ["U_BPP_DEVOL", "U_BPP_DEVOL"],
                ["U_MSSL_GRPART", "U_MSSL_GRPART"],
                ["IdAlmacen", "IdAlmacen"],
                [Sequelize.col("ArticuloNegocio.Articulo.IdArticulo"), "IdArticulo"],
                [Sequelize.col("ArticuloNegocio.Articulo.GrupoArticulo.U_Devolucion"), "U_Devolucion"],
                ["PendienteDevolver", "CantidadDevuelto"],
                [Sequelize.col("Almacene.Nombre"), "Almacen"],
                [Sequelize.col("EstadoDetalles.FechaCreacion"), "FechaCreacion"],
            ],
            where: {
                IdUsuario,
                PendienteDevolver: {
                    [Op.gt]: 0
                }
            },
            include: [
                {
                    model: ArticuloNegocio,
                    attributes: [],
                    include: {
                        model: Articulo,
                        attributes: [],
                        include: {
                            model: GrupoArticulo,
                            attributes: [],
                        }
                    }
                },
                {
                    model: Almacen,
                    attributes: [],
                },
                {
                    model: EstadoDetalle,
                    attributes: [],
                    where: {
                        IdParametro: ESTADO_DETALLE_SOLICITUD.ENTREGADO
                    },
                    required: true
                }
            ],
            raw: true
        })
        res.json(detalle)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}