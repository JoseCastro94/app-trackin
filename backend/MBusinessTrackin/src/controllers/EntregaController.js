import DetalleDespachoSolicitudArticuloRepository from "../repositories/DetalleDespachoSolicitudArticuloRepository.js";
import DespachoSolicitudArticuloRepository from "../repositories/DespachoSolicitudArticuloRepository.js";
import DetalleSolicitudArticuloRepository from "../repositories/DetalleSolicitudArticuloRepository.js";
import SolicitudArticuloRepository from "../repositories/SolicitudArticuloRepository.js";
import TransacAlmacenRepository from "../repositories/TransacAlmacenRepository.js";
import GrupoParametroRepository from "../repositories/GrupoParametroRepository.js";
import ControlSerieRepository from "../repositories/ControlSerieRepository.js";
import { generateAttachment } from "../helper/GeneratePDF.js";
import { EstadoDetalle } from "../models/EstadoDetalle.js";
import { ProcesarStock } from "../operations/stocks.js";
import { sequelize } from "../database/database.js";
import BaseController from "./BaseController.js";
import { Estado } from "../models/Estado.js";
import Sequelize from "sequelize";
import fetch from "node-fetch";
import { DetalleSolicitudArticulo } from '../models/DetalleSolicitudArticulo.js'
import { DetalleDespachoSolicitud } from '../models/DetalleDespachoSolicitud.js'

class EntregaController extends BaseController {
    static create = async (req, res) => {
        const { user, company } = req.headers
        const { body } = req
        const estados = await GrupoParametroRepository.getParametros('9e0ed3d9-435c-49b1-a67e-31052e08f912')
        const estadosSolicitud = await GrupoParametroRepository.getParametros('8e0ed3d9-435c-49b1-a67e-31052e08f912')
        const estadosDetalleSolicitud = await GrupoParametroRepository.getParametros('910ed3d9-435c-49b1-a67e-31052e08f912')

        const articulos = body.detalle.filter(articulo => articulo.entrega > 0)
        const articulos_con_serie_empty = body.detalle.filter(articulo => articulo.entrega === 0)
        if (articulos.length === 0) {
            return this.infoResponse(res, {
                message: 'No hay datos para procesar.'
            })
        }

        const series = articulos.filter(articulo => articulo.has_serie).map(articulo => articulo.serie)
        const seriesNoDisponibles = await ControlSerieRepository.findBySeries(series)

        if (seriesNoDisponibles.length > 0) {
            const series = seriesNoDisponibles.map(item => item.serie)
            return this.infoResponse(res, {
                message: `Las series no estan disponibles: ${series.toString()}`
            })
        }

        let transaction = await sequelize.transaction({
            autocommit: false,
            isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED
        })

        try {
            const detalleSolicitudArray = []
            const detalleDespachoArray = []
            const transac = []
            const comprometidosPromiseArray = []
            const updateControlSeriesPromiseArray = []
            const articulosSinRepetir = []

            for (const articulo_con_serie_empty of articulos_con_serie_empty) {
                console.log(`--------Artículo sin entrega: ${articulo_con_serie_empty.cantidad_picking} en el ${articulo_con_serie_empty.id_detalle_solicitud}`)
                await DetalleSolicitudArticulo.decrement({
                    CantidadProgramada: articulo_con_serie_empty.cantidad_picking
                }, {
                    where: {
                        IdDetalleSocilitud: articulo_con_serie_empty.id_detalle_solicitud
                    },
                    transaction: transaction
                })
            }

            for (let i = 0; i < articulos.length; i++) {
                const item = articulos[i]
                await ProcesarStock({
                    IdTipoTransac: 'ENTREGA',
                    ItemCode: item.codigo_producto,
                    ItemName: item.nombre_producto,
                    Cantidad: item.entrega * -1,
                    Tipo: 'ENTREGA',
                    UsuarioCreacion: user.username,
                    IdUsuario: user.id_user,
                    IdEmpresa: company.id,
                    IdAlmacenOrigen: item.id_almacen,
                    IdDetalleSolicitud: item.id_detalle_solicitud,
                    IdDetalleDespacho: item.id_detalle_despacho,
                    IdNegocio: item.id_negocio,
                    IdArticulo: item.id_articulo,
                    Grupo: item.categoria,
                    Devolucion: item.devolucion,
                    TransferStock: 'ASIGNADO',
                    TipoStock: 'COMPROMETIDO',
                    transaction
                })

                const exist = articulosSinRepetir.some(articulo => articulo.id_detalle_solicitud === item.id_detalle_solicitud)
                if (!exist) articulosSinRepetir.push(item)

                detalleDespachoArray.push(DetalleDespachoSolicitudArticuloRepository.update({
                    IdEstadoEntrega: estados[2].id,
                    CantidadEntrega: item.entrega,
                    PendienteDevolver: item.entrega,
                    SerialNumber: !item.serie ? null : item.serie
                }, {
                    IdDetalleDespacho: item.id_detalle_despacho
                }, transaction))

                if (item.entrega != item.cantidad_picking) {
                    const diferencia_entrega = item.cantidad_picking - item.entrega
                    console.log(`--------Diferencia: ${diferencia_entrega} en el ${item.id_detalle_solicitud}`)
                    await DetalleSolicitudArticulo.decrement({
                        CantidadProgramada: diferencia_entrega
                    }, {
                        where: {
                            IdDetalleSocilitud: item.id_detalle_solicitud
                        },
                        transaction: transaction
                    })
                }

                comprometidosPromiseArray.push(TransacAlmacenRepository.buscarUltimoComprometido({
                    IdDetalleSolicitud: item.id_detalle_solicitud,
                    IdArticulo: item.id_articulo,
                    IdNegocio: item.id_negocio,
                    IdAlmacenOrigen: item.id_almacen,
                    Tipo: 'COMPROMETIDO'
                }))

                if (item.has_serie) {
                    updateControlSeriesPromiseArray.push(ControlSerieRepository.update({
                        IdEstado: '3cef370c-5053-4c4f-af06-d696bb8b4ace',
                        UsuarioModifica: user.username
                    }, {
                        IdControlSerie: item.id_control_serie
                    }, transaction))
                }
            }

            const historialDetalleEstados = []
            for (let i = 0; i < articulosSinRepetir.length; i++) {
                const articulo = articulosSinRepetir[i]
                const cantidad_entrega_previa = await TransacAlmacenRepository.getCantidad({
                    IdDetalleSolicitud: articulo.id_detalle_solicitud,
                    IdArticulo: articulo.id_articulo,
                    IdNegocio: articulo.id_negocio,
                    IdAlmacenOrigen: articulo.id_almacen,
                    Tipo: 'ENTREGA'
                })
                console.log('cantidad_entrega_previa', cantidad_entrega_previa)
                const entregado = Number(articulo.cantidad_solicitada) === (Number(cantidad_entrega_previa) + Number(articulo.entrega))
                console.log('entregado', entregado)
                if (entregado) {
                    historialDetalleEstados.push({
                        UsuarioCreacion: user.username,
                        IdDetalleSolicitud: articulo.id_detalle_solicitud,
                        IdParametro: '99cf2544-a507-4ff1-b7b1-174a1e158dd0',
                    })
                    detalleSolicitudArray.push(DetalleSolicitudArticuloRepository.update({
                        IdEstado: estadosDetalleSolicitud[1].id,
                        UsuarioModifica: user.username
                    }, {
                        IdDetalleSocilitud: articulo.id_detalle_solicitud
                    }, transaction))
                }

                if (Number(articulo.cantidad_solicitada) > (Number(cantidad_entrega_previa) + Number(articulo.entrega))) {
                    historialDetalleEstados.push({
                        UsuarioCreacion: user.username,
                        IdDetalleSolicitud: articulo.id_detalle_solicitud,
                        IdParametro: estadosDetalleSolicitud[0].id,
                    })
                    detalleSolicitudArray.push(DetalleSolicitudArticuloRepository.update({
                        IdEstado: estadosDetalleSolicitud[0].id,
                        UsuarioModifica: user.username
                    }, {
                        IdDetalleSocilitud: articulo.id_detalle_solicitud
                    }, transaction))
                }
            }
            console.log('detalleSolicitudArray', detalleSolicitudArray)
            await EstadoDetalle.bulkCreate(historialDetalleEstados, { transaction })

            let comprometidos = await Promise.all(comprometidosPromiseArray)
            comprometidos = comprometidos.filter((comprometido, index, array) => {
                return array.findIndex(value => JSON.stringify(value) === JSON.stringify(comprometido)) === index
            })
            const transacReversa = comprometidos.map(comprometido => {
                const data = { ...comprometido }
                data.IdTipoTransac = 'REV'
                data.Cantidad *= -1
                data.Tipo = 'COMPRO_INGRE'
                data.IdUsuario = user.id_user
                data.UsuarioCreacion = user.username
                return data
            })
            const transacNuevoComprometido = comprometidos.map((item, index) => {
                const data = { ...item }
                const cantidad = articulos.filter(articulo =>
                    articulo.id_detalle_solicitud === data.IdDetalleSolicitud &&
                    articulo.id_articulo === data.IdArticulo &&
                    articulo.id_negocio === data.IdNegocio &&
                    articulo.id_almacen === data.IdAlmacenOrigen)
                    .reduce((pre, articulo) => pre + Number(articulo.entrega), 0)
                data.Tipo = 'COMPROMETIDO'
                data.IdUsuario = user.id_user
                data.UsuarioCreacion = user.username
                data.Cantidad = data.Cantidad - (-cantidad)
                return data
            }).filter(item => item.Cantidad < 0)
            await TransacAlmacenRepository.create(transacReversa, transaction)
            await Promise.all(updateControlSeriesPromiseArray)
            //await Promise.all(transac)
            if (transacNuevoComprometido.length > 0) {
                await TransacAlmacenRepository.create(transacNuevoComprometido, transaction)
            }

            await DespachoSolicitudArticuloRepository.update({
                IdEstado: estados[2].id,
                Observacionnnnn: body.comentario
            }, {
                IdDespacho: body.id
            }, transaction);

            await Promise.all(detalleDespachoArray)
            await Promise.all(detalleSolicitudArray)
            await transaction.commit()

            const pendientesEntrega = await DespachoSolicitudArticuloRepository.listarCantidadEntregado(body.id)
            console.log('pendientesEntrega', pendientesEntrega)
            console.log('estadosSolicitud', estadosSolicitud)
            if (pendientesEntrega.length === 0) {
                console.log('pendientesEntrega.length', pendientesEntrega.length)
                await SolicitudArticuloRepository.update({
                    params: {
                        IdEstado: estadosSolicitud[2].id,
                        UsuarioModifica: 'RAST'
                    },
                    id: body.id_solicitud
                })

                await Estado.create({
                    Tipo: 'PEDIDO',
                    UsuarioCreacion: user.username,
                    IdSocilitud: body.id_solicitud,
                    IdParametro: estadosSolicitud[2].id,
                })
            }
            const data = await DespachoSolicitudArticuloRepository.findById(body.id)
            const attachments = [
                {
                    filename: 'cargo-entrega.pdf',
                    content: await generateAttachment(data, 'entrega-notificacion'),
                    encoding: 'base64'
                }
            ]

            await fetch(process.env.API_MAILING, {
                method: 'POST',
                body: JSON.stringify({
                    'email': body.email_asignado,
                    'subject': 'ENTREGA ARTÍCULOS',
                    'template': 'entrega.template',
                    'data': data,
                    attachments
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return this.createdResponse(res)
        } catch (error) {
            if (transaction.finished !== 'commit')
                await transaction.rollback()
            return this.errorResponse(res, error)
        }
    }

    static delete = async (req, res) => {
        let transaction = await sequelize.transaction({
            autocommit: false,
            isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED
        })

        try {
            const { id } = req.params
            const { user } = req.headers
            const detalleDespacho = await DetalleDespachoSolicitudArticuloRepository.listar(id)
            const detalleDespachoIds = detalleDespacho.map(detalle => detalle.IdDetalleDespacho)
            let transac = await TransacAlmacenRepository.findByIdDetalleDespacho(detalleDespachoIds)
            transac = transac.map(item => {
                delete item.IdTransac
                item.Cantidad = item.Cantidad * -1
                item.FechaCreacion = new Date()
                return item
            })
            await TransacAlmacenRepository.create(transac)
            await DespachoSolicitudArticuloRepository.update({
                IdEstado: '75cf2544-a507-4ff1-b7b1-174a1e158dd0',
                UsuarioModifica: user.username,
                FechaModifica: new Date()
            }, {
                IdDespacho: id
            })
            await DetalleDespachoSolicitudArticuloRepository.update({
                IdEstado: '75cf2544-a507-4ff1-b7b1-174a1e158dd0',
                UsuarioModifica: user.username,
                FechaModifica: new Date()
            }, {
                IdDespacho: id
            })

            const find_detalle_solicitud = await DetalleSolicitudArticulo.findAll({
                include: {
                    model: DetalleDespachoSolicitud,
                    required: true,
                    where: {
                        IdDespacho: id
                    },
                    nested: false
                }
            })

            for (const item of find_detalle_solicitud) {
                let cantidad = 0
                if (Array.isArray(item.DetalleDespachoSolicituds)) {
                    item.DetalleDespachoSolicituds.forEach(c => {
                        cantidad += c.CantidadPicking
                    })
                }

                await DetalleSolicitudArticulo.decrement({
                    CantidadProgramada: cantidad
                }, {
                    where: {
                        IdDetalleSocilitud: item.IdDetalleSocilitud
                    }
                })
            }

            await transaction.commit()
            return this.deletedResponse(res)
        } catch (error) {
            await transaction.rollback()
            return this.errorResponse(res, error)
        }
    }

    static notificarPorEmail = async (req, res) => {
        try {
            const { body } = req
            const { user } = req.headers
            const data = await DespachoSolicitudArticuloRepository.findById(body.id)
            const attachments = [
                {
                    filename: 'cargo-entrega.pdf',
                    content: await generateAttachment(data, 'entrega-notificacion'),
                    encoding: 'base64'
                }
            ]

            await fetch(process.env.API_MAILING, {
                method: 'POST',
                body: JSON.stringify({
                    'email': user.correo,
                    'subject': 'ENTREGA',
                    'template': 'entrega.template',
                    'data': data,
                    attachments
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return this.infoResponse(res, {
                title: 'Envío correo',
                message: 'Se envió el correo correctamente',
            })
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }
}

export default EntregaController
