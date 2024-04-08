import Util from '../utils/Util.js'
import { STATUS_INCIDENCIAS } from '../storage/const.js'
import { MovimientoMercancia } from '../models/MovimientoMercancia.js'
import { DetalleMovimientoMercancia } from '../models/DetalleMovimientoMercancia.js'
import { ControlSerie } from '../models/ControlSerie.js'
import { Articulo } from '../models/Articulo.js'
import { GrupoArticulo } from '../models/GrupoArticulo.js'
import { Almacen } from '../models/Almacen.js'
import { UsuarioNegocio } from '../models/UsuarioNegocio.js'
import { ArticuloNegocio } from '../models/ArticuloNegocio.js'
import { SolicitudArticulo } from '../models/SolicitudArticulo.js'
import { DetalleSolicitudArticulo } from '../models/DetalleSolicitudArticulo.js'
import { DespachoSolicitud } from '../models/DespachoSolicitud.js'
import { DetalleDespachoSolicitud } from '../models/DetalleDespachoSolicitud.js'

import {
    STATUS_CONTROL_SERIE,
    ESTADO_SOLICITUD,
    ESTADO_DETALLE_SOLICITUD,
    STATUS_DESPACHO,
} from '../storage/const.js'
import { ProcesarStock } from '../operations/stocks.js'

import MovimientoMercanciaRepository from '../repositories/MovimientoMercanciaRepository.js'
import DespachoSolicitudArticuloRepository from '../repositories/DespachoSolicitudArticuloRepository.js'

const log = (msg) => {
    console.log(`-----------------------------`)
    console.log(msg)
    console.log(`-----------------------------`)
}

const MOTIVO = 'CARGAINICIAL'

const process_merchandise_entry = async ({
    doc_refe = MOTIVO,
    ruc = '20512574212',
    razon_social = 'TAWA CONSULTING S.A.C.',
    tipo = '2ffd2b48-470f-4330-aeb9-094c66b9c231',
    tipo_doc = 'c1370d68-0c41-41ec-8605-8831c79c49c7',
    id_almacen,
    codigo_usuario,
    detalle = []
}) => {
    const find_almacen = await Almacen.findOne({
        where: {
            IdAlmacen: id_almacen
        }
    })

    const control_series = []

    const process_detail = async ({
        ItemCode,
        Cantidad,
        IdNegocio,
        SerialNumber,
        IdUsuario,
    }) => {
        const find_articulo = await Articulo.findOne({
            include: GrupoArticulo,
            where: {
                ItemCode: ItemCode
            }
        })

        if (!find_articulo) {
            throw new Error('No se encontró articulo')
        }

        if (SerialNumber) {
            control_series.push({
                SerialNumber: SerialNumber,
                UsuarioCreacion: codigo_usuario,
                UsuarioModifica: codigo_usuario,
                IdAlmacen: id_almacen,
                IdNegocio: IdNegocio,
                IdArticulo: find_articulo.IdArticulo,
                IdGrupoArticulo: find_articulo.GrupoArticulo.IdGrupoArticulo,
                IdEstado: STATUS_CONTROL_SERIE.DISPONIBLE,
                IdEmpresa: find_almacen.IdEmpresa,
            })
        }

        await ProcesarStock({
            IdTipoTransac: 'ING',
            Cantidad: Cantidad,
            Tipo: 'INGRESO',
            UsuarioCreacion: codigo_usuario,
            IdUsuario: IdUsuario,
            IdEmpresa: find_almacen.IdEmpresa,
            IdAlmacenOrigen: id_almacen,
            IdDetalleSolicitud: null,
            IdNegocio: IdNegocio,
            IdArticulo: find_articulo.IdArticulo,
            ItemCode: find_articulo.ItemCode,
            ItemName: find_articulo.ItemName,
            Devolucion: find_articulo.GrupoArticulo.U_Devolucion,
            Grupo: find_articulo.GrupoArticulo.Nombre,
        }).then()

        log(`Se procesó stock - el articulo ${find_articulo.ItemCode} de la empresa ${find_almacen.Nombre} con la cantidad ${Cantidad}`)

        return {
            ItemName: find_articulo.ItemName,
            Nombre_GrupArt: find_articulo.GrupoArticulo.Nombre,
            U_BPP_TIPUNMED: find_articulo.U_BPP_TIPUNMED,
            U_Devolicion: find_articulo.GrupoArticulo.U_Devolucion,
            U_DiasDevolicion: find_articulo.GrupoArticulo.U_DiasEntrega,
            CodeBars: find_articulo.Codebars,
            Cantidad: Cantidad,
            Observacion: MOTIVO,
            Categoria: find_articulo.GrupoArticulo.Nombre,
            Almacen: find_almacen.Nombre,
            SerialNumber: SerialNumber,
            UsuarioCreacion: codigo_usuario,
            UsuarioModifica: codigo_usuario,
            IdNegocio: IdNegocio,
            IdArticulo: find_articulo.IdArticulo,
        }
    }

    const detail = []
    for (const row of detalle) {
        const result_row = await process_detail(row)
        detail.push(result_row)
    }

    return {
        DocReference: doc_refe,
        Ruc: ruc,
        RazonSocial: razon_social,
        Correos: '',
        UsuarioCreacion: codigo_usuario,
        UsuarioModifica: codigo_usuario,
        IdAlmacen: id_almacen,
        IdEmpresa: find_almacen.IdEmpresa,
        IdTipo: tipo,
        IdTipoDoc: tipo_doc,
        DetalleMovimientoMercancia: detail,
        ControlSeries: control_series
    }
}

const process_request = async ({
    tipo = 'PEDIDO',
    fecha_proceso = new Date(),
    motivo = MOTIVO,
    codigo_usuario,
    id_usuario_solicita,
    id_empresa,
    detalle = []
}) => {
    let now = new Date()
    let year = now.getFullYear()

    let last_corr = await SolicitudArticulo.max('Correlativo', {
        where: {
            Tipo: tipo,
            Periodo: year
        }
    })

    let corr = 1

    if (last_corr) {
        corr = last_corr + 1
    }

    const requests = {
        Tipo: tipo,
        Periodo: year,
        Correlativo: corr,
        FechaSolicitud: fecha_proceso,
        FechaPropuesta: fecha_proceso,
        MotivoSolicitud: motivo,
        UsuarioCreacion: codigo_usuario,
        UsuarioModifica: codigo_usuario,
        IdUsuarioSolicita: id_usuario_solicita,
        IdEmpresa: id_empresa,
        IdEstado: ESTADO_SOLICITUD.PENDIENTE,
        DetalleSolicitudArticulos: []
    }
    for (const detalle_request of detalle) {
        const find_articulo = await Articulo.findOne({
            include: GrupoArticulo,
            where: {
                ItemCode: detalle_request.ItemCode
            }
        })

        let find_usuario_negocio = await UsuarioNegocio.findOne({
            where: {
                IdUsuario: detalle_request.IdUsuario,
                IdNegocio: detalle_request.IdNegocio,
            }
        })

        if (!find_usuario_negocio) {
            find_usuario_negocio = await UsuarioNegocio.create({
                IdUsuario: detalle_request.IdUsuario,
                IdNegocio: detalle_request.IdNegocio,
                UsuarioCreacion: codigo_usuario,
                UsuarioModifica: codigo_usuario,
            })
        }

        let find_articulo_negocio = await ArticuloNegocio.findOne({
            where: {
                IdNegocio: detalle_request.IdNegocio,
                IdArticulo: find_articulo.IdArticulo,
            }
        })

        if (!find_articulo_negocio) {
            find_articulo_negocio = await ArticuloNegocio.create({
                IdNegocio: detalle_request.IdNegocio,
                IdArticulo: find_articulo.IdArticulo,
                UsuarioCreacion: codigo_usuario,
                UsuarioModifica: codigo_usuario,
            })
        }

        requests.DetalleSolicitudArticulos.push({
            ItemCode: find_articulo.ItemCode,
            ItemName: find_articulo.ItemName,
            Cantidad: detalle_request.Cantidad,
            CCosto: detalle_request.CCosto,
            CodigoCCosto: detalle_request.CodigoCCosto,
            U_MSSL_GRPART: find_articulo.GrupoArticulo.U_Evaluacion,
            U_BPP_TIPUNMED: find_articulo.U_BPP_TIPUNMED,
            U_BPP_DEVOL: find_articulo.GrupoArticulo.U_Devolucion,
            SerialNumber: detalle_request.SerialNumber,
            Observacion: MOTIVO,
            UsuarioCreacion: codigo_usuario,
            UsuarioModifica: codigo_usuario,
            IdUsuarioNegocio: find_usuario_negocio.IdUsuarioNegocio,
            IdUsuario: detalle_request.IdUsuario,
            IdAlmacen: detalle_request.IdAlmacen,
            IdArticuloNegocio: find_articulo_negocio.IdArticuloNegocio,
            IdNegocio: detalle_request.IdNegocio,
            IdEstado: ESTADO_DETALLE_SOLICITUD.PENDIENTE
        })
    }
    return requests
}

const process_dispatch = async ({
    fecha_programada = new Date(),
    observacion = MOTIVO,
    tipo_translado = 0,
    cargo = '0',
    atachment1 = '',
    atachment2 = '',
    codigo_usuario,
    id_socilitud,
    id_asignado,
    id_almacen,
    id_empresa,
    id_estado = STATUS_DESPACHO.PROGRAMADO,
    detalle = []
}) => {
    const codigo = await DespachoSolicitudArticuloRepository.getCodigo()

    const detalle_despacho = []

    for (const row of detalle) {
        detalle_despacho.push({
            ItemCode: row.ItemCode,
            ItemName: row.ItemName,
            U_BPP_TIPUNMED: null,
            CantidadPicking: row.Cantidad,
            UsuarioCreacion: codigo_usuario,
            UsuarioModifica: codigo_usuario,
            IdDetalleSolicitud: row.IdDetalleSocilitud,
            SerialNumber: row.SerialNumber,
            IdEstadoEntrega: id_estado,
            ComentarioMotivoDevolucion: observacion
        })
    }

    return {
        Codigo: codigo,
        FechaProgramada: fecha_programada,
        Observacion: observacion,
        TipoTraslado: tipo_translado,
        Cargo: cargo,
        Atachment1: atachment1,
        Atachment2: atachment2,
        UsuarioCreacion: codigo_usuario,
        UsuarioModifica: codigo_usuario,
        IdSocilitud: id_socilitud,
        IdAsignado: id_asignado,
        IdAlmacen: id_almacen,
        IdEmpresa: id_empresa,
        IdEstado: id_estado,
        DetalleDespachoSolicituds: detalle_despacho
    }
}

export const article_allocation = async (req, res) => {
    const { user, company } = req.headers
    const usuario_activo = user.username
    const id_usuario_activo = user.id_user
    const id_empresa_activo = company.id

    try {
        let parametros = []
        parametros = await Util.readLoopExcel(req.files)

        const head = parametros[0]
        const body = parametros[1]

        log('Comienzo del proceso de carga')
        ///proceso de ingreso de mercadería

        const list_warehouse = []
        body.forEach(element => {
            const find_warehouse = list_warehouse.find(f => f.IdAlmacen === element.IdAlmacen)
            if (!find_warehouse) {
                list_warehouse.push({
                    IdAlmacen: element.IdAlmacen,
                    detail: [
                        {
                            IdUsuario: element.IdUsuario,
                            IdNegocio: element.IdNegocio,
                            ItemCode: element.ItemCode,
                            SerialNumber: element.SerialNumber === '[NULL]' ? null : element.SerialNumber,
                            Cantidad: element.Cantidad,
                        }
                    ]
                })
            } else {
                find_warehouse.detail.push({
                    IdUsuario: element.IdUsuario,
                    IdNegocio: element.IdNegocio,
                    ItemCode: element.ItemCode,
                    SerialNumber: element.SerialNumber === '[NULL]' ? null : element.SerialNumber,
                    Cantidad: element.Cantidad,
                })
            }
        })

        const result_mercaderia = []
        for (const row of list_warehouse) {
            const result_row = await process_merchandise_entry({
                id_almacen: row.IdAlmacen,
                codigo_usuario: usuario_activo,
                detalle: row.detail,
            })
            result_mercaderia.push(result_row)
        }

        const ins_movimiento_mercaderia = []

        for (const row of result_mercaderia) {
            row.Codigo = await MovimientoMercanciaRepository.getCodigo()
            const ins = await MovimientoMercancia.create(row, {
                include: [DetalleMovimientoMercancia, ControlSerie]
            })
            log(`Se registró la mercadería - el código es ${row.Codigo}`)
            ins_movimiento_mercaderia.push(ins)
        }

        log('Comienzo del proceso de solicitud')
        ///proceso de registro de solicitud

        const list_request = []
        head.forEach(element => {
            const request = {
                IdUsuarioSolicita: element.IdUsuarioSolicita,
                IdEmpresa: element.IdEmpresa,
            }

            const detalle = body
                .filter(f => f.IdSocilitud === element.IdSocilitud)
                .map(detalle_request => {
                    return {
                        ItemCode: detalle_request.ItemCode,
                        Cantidad: detalle_request.Cantidad,
                        CCosto: detalle_request.CCosto,
                        CodigoCCosto: detalle_request.CodigoCCosto,
                        IdUsuario: detalle_request.IdUsuario,
                        IdAlmacen: detalle_request.IdAlmacen,
                        IdNegocio: detalle_request.IdNegocio,
                        SerialNumber: detalle_request.SerialNumber === '[NULL]' ? null : detalle_request.SerialNumber,
                    }
                })

            request.detalle = detalle
            list_request.push(request)
        })

        const send_request = []
        for (const request of list_request) {
            const request_data = await process_request({
                codigo_usuario: usuario_activo,
                id_usuario_solicita: request.IdUsuarioSolicita,
                id_empresa: request.IdEmpresa,
                detalle: request.detalle
            })

            const result_data = await SolicitudArticulo
                .create(request_data, {
                    include: [DetalleSolicitudArticulo]
                })
            log(`Se registró la solicitud - el código es ${result_data.IdSocilitud}`)

            for (const detail_process of result_data.DetalleSolicitudArticulos) {
                const find_articulo = await ArticuloNegocio.findOne({
                    include: {
                        model: Articulo,
                        include: {
                            model: GrupoArticulo
                        }
                    },
                    where: {
                        IdArticuloNegocio: detail_process.IdArticuloNegocio
                    }
                })
                await ProcesarStock({
                    IdTipoTransac: 'SOL',
                    Cantidad: - detail_process.Cantidad,
                    Tipo: 'COMPROMETIDO',
                    UsuarioCreacion: usuario_activo,
                    IdUsuario: result_data.IdUsuarioSolicita,
                    IdEmpresa: result_data.IdEmpresa,
                    IdAlmacenOrigen: detail_process.IdAlmacen,
                    IdDetalleSolicitud: detail_process.IdDetalleSocilitud,
                    IdNegocio: detail_process.IdNegocio,
                    IdArticulo: find_articulo.IdArticulo,
                    ItemCode: detail_process.ItemCode,
                    ItemName: detail_process.ItemName,
                    Devolucion: find_articulo.Articulo.GrupoArticulo.U_Devolucion,
                    Grupo: find_articulo.Articulo.GrupoArticulo.Nombre,
                    TransferStock: 'COMPROMETIDO'
                }).then()

                log(`Se procesó stock - el articulo ${detail_process.ItemCode} de la empresa ${result_data.IdEmpresa} con la cantidad ${detail_process.Cantidad}`)
            }

            send_request.push(result_data)
        }

        log('Comienzo del proceso de despacho')
        ///proceso de registro de despacho

        const send_dispatch = []
        for (const request of send_request) {
            for (const detail_request of request.DetalleSolicitudArticulos) {
                const data_dispatch = await process_dispatch({
                    codigo_usuario: usuario_activo,
                    id_socilitud: request.IdSocilitud,
                    id_asignado: detail_request.IdUsuario,
                    id_almacen: detail_request.IdAlmacen,
                    id_empresa: request.IdEmpresa,
                    detalle: [{
                        ItemCode: detail_request.ItemCode,
                        ItemName: detail_request.ItemName,
                        Cantidad: detail_request.Cantidad,
                        SerialNumber: detail_request.SerialNumber,
                        IdDetalleSocilitud: detail_request.IdDetalleSocilitud,
                    }]
                })

                const result_data = await DespachoSolicitud
                    .create(data_dispatch, {
                        include: [DetalleDespachoSolicitud]
                    })

                const find_detalle_solicitud = await DetalleSolicitudArticulo.findOne({
                    include: {
                        model: ArticuloNegocio,
                        include: {
                            model: Articulo,
                            include: {
                                model: GrupoArticulo
                            }
                        }
                    },
                    where: {
                        IdDetalleSocilitud: result_data.DetalleDespachoSolicituds[0].IdDetalleSolicitud
                    }
                })

                log(`Se registró el despacho - el código es ${result_data.IdDespacho}`)

                await ProcesarStock({
                    IdTipoTransac: 'DESP',
                    ItemCode: result_data.DetalleDespachoSolicituds[0].ItemCode,
                    ItemName: result_data.DetalleDespachoSolicituds[0].ItemName,
                    Cantidad: result_data.DetalleDespachoSolicituds[0].CantidadPicking,
                    Tipo: 'PICKPACK',
                    UsuarioCreacion: usuario_activo,
                    IdUsuario: result_data.IdAsignado,
                    IdEmpresa: result_data.IdEmpresa,
                    IdAlmacenOrigen: result_data.IdAlmacen,
                    IdDetalleSolicitud: result_data.DetalleDespachoSolicituds[0].IdDetalleSolicitud,
                    IdDetalleDespacho: result_data.DetalleDespachoSolicituds[0].IdDetalleDespacho,
                    IdNegocio: find_detalle_solicitud.IdNegocio,
                    IdArticulo: find_detalle_solicitud.ArticuloNegocio.IdArticulo,
                    Grupo: find_detalle_solicitud.ArticuloNegocio.Articulo.GrupoArticulo.Nombre,
                    Devolucion: find_detalle_solicitud.ArticuloNegocio.Articulo.GrupoArticulo.U_Devolucion,
                }).then()

                log(`Se procesó stock - el articulo ${result_data.DetalleDespachoSolicituds[0].ItemCode} de la empresa ${result_data.IdEmpresa} con la cantidad ${result_data.DetalleDespachoSolicituds[0].CantidadPicking}`)

                await SolicitudArticulo.upsert({
                    IdSocilitud: request.IdSocilitud,
                    IdEstado: ESTADO_SOLICITUD.EN_PROCESO,
                    UsuarioModifica: usuario_activo,
                    FechaModifica: new Date(),
                })

                log(`Se actualizó el estado de la solicitud - el código es ${request.IdSocilitud}`)

                await DetalleSolicitudArticulo.upsert({
                    IdDetalleSocilitud: result_data.DetalleDespachoSolicituds[0].IdDetalleSolicitud,
                    IdEstado: ESTADO_DETALLE_SOLICITUD.PROGRAMADO,
                    UsuarioModifica: usuario_activo,
                    FechaModifica: new Date(),
                })

                log(`Se actualizó el estado del detalle de solicitud - el código es ${result_data.DetalleDespachoSolicituds[0].IdDetalleSolicitud}`)

                send_dispatch.push(result_data)
            }
        }

        log('Comienzo del proceso de entrega')
        ///proceso de registro de entrega

        for (const dispatch of send_dispatch) {
            for (const detail_dispatch of dispatch.DetalleDespachoSolicituds) {
                const find_detalle_solicitud = await DetalleSolicitudArticulo.findOne({
                    include: {
                        model: ArticuloNegocio,
                        include: {
                            model: Articulo,
                            include: {
                                model: GrupoArticulo
                            }
                        }
                    },
                    where: {
                        IdDetalleSocilitud: detail_dispatch.IdDetalleSolicitud
                    }
                })

                await ProcesarStock({
                    IdTipoTransac: 'ENTREGA',
                    ItemCode: detail_dispatch.ItemCode,
                    ItemName: detail_dispatch.ItemName,
                    Cantidad: detail_dispatch.CantidadPicking * -1,
                    Tipo: 'ENTREGA',
                    UsuarioCreacion: usuario_activo,
                    IdUsuario: dispatch.IdAsignado,
                    IdEmpresa: dispatch.IdEmpresa,
                    IdAlmacenOrigen: dispatch.IdAlmacen,
                    IdDetalleSolicitud: detail_dispatch.IdDetalleSolicitud,
                    IdDetalleDespacho: detail_dispatch.IdDetalleDespacho,
                    IdNegocio: find_detalle_solicitud.IdNegocio,
                    IdArticulo: find_detalle_solicitud.ArticuloNegocio.IdArticulo,
                    Grupo: find_detalle_solicitud.ArticuloNegocio.Articulo.GrupoArticulo.Nombre,
                    Devolucion: find_detalle_solicitud.ArticuloNegocio.Articulo.GrupoArticulo.U_Devolucion,
                    TransferStock: 'ASIGNADO',
                    TipoStock: 'COMPROMETIDO',
                }).then()

                log(`Se procesó la stock de entrega - el articulo ${detail_dispatch.ItemCode} de la empresa ${dispatch.IdEmpresa} con la cantidad ${detail_dispatch.CantidadPicking}`)

                await DetalleDespachoSolicitud.upsert({
                    IdDetalleDespacho: detail_dispatch.IdDetalleDespacho,
                    IdEstadoEntrega: STATUS_DESPACHO.ENTREGA,
                    CantidadEntrega: detail_dispatch.CantidadPicking,
                    PendienteDevolver: detail_dispatch.CantidadPicking,
                    SerialNumber: detail_dispatch.SerialNumber,
                })

                log(`Se actualizó el detalle despacho - el código es del despacho es ${detail_dispatch.IdDetalleDespacho}`)

                if (detail_dispatch.SerialNumber) {
                    const find_control_serie = await ControlSerie.findOne({
                        where: {
                            SerialNumber: detail_dispatch.SerialNumber,
                            IdAlmacen: dispatch.IdAlmacen,
                            IdNegocio: find_detalle_solicitud.IdNegocio,
                            IdArticulo: find_detalle_solicitud.ArticuloNegocio.IdArticulo
                        }
                    })

                    if (find_control_serie) {
                        await ControlSerie.upsert({
                            IdControlSerie: find_control_serie.IdControlSerie,
                            IdEstado: STATUS_CONTROL_SERIE.ASIGNADO,
                            UsuarioModifica: usuario_activo,
                            FechaModifica: new Date()
                        })
                        log(`Se actualizó el control de serie - el código es ${find_control_serie.IdControlSerie}`)
                    } else {
                        log(`No se encontró el control de serie`)
                    }
                }

                await DetalleSolicitudArticulo.upsert({
                    IdDetalleSocilitud: detail_dispatch.IdDetalleSolicitud,
                    IdEstado: ESTADO_DETALLE_SOLICITUD.ENTREGADO,
                    UsuarioModifica: usuario_activo,
                    FechaModifica: new Date()
                })

                log(`Se actualizó el detalle de solicitud - el código es ${detail_dispatch.IdDetalleSolicitud}`)

                await SolicitudArticulo.upsert({
                    IdSocilitud: dispatch.IdSocilitud,
                    IdEstado: ESTADO_SOLICITUD.ENTREGADO,
                    UsuarioModifica: usuario_activo,
                    FechaModifica: new Date()
                })

                log(`Se actualizó la solicitud - el código es ${dispatch.IdSocilitud}`)
            }
        }

        res.status(200).json({
            status: 'Ok',
            head: head,
            body: body,
            send_dispatch,
        })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: e.message });
    }
}