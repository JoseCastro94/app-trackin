import DespachoSolicitudArticuloRepository from "../repositories/DespachoSolicitudArticuloRepository.js";
import DetalleSolicitudArticuloRepository from "../repositories/DetalleSolicitudArticuloRepository.js";
import SolicitudArticuloRepository from "../repositories/SolicitudArticuloRepository.js";
import GrupoParametroRepository from "../repositories/GrupoParametroRepository.js";
import UsuarioAlmacenRepository from "../repositories/UsuarioAlmacenRepository.js";
import {generateAttachment} from "../helper/GeneratePDF.js";
import {EstadoDetalle} from "../models/EstadoDetalle.js";
import {ProcesarStock} from "../operations/stocks.js";
import {sequelize} from "../database/database.js";
import BaseController from "./BaseController.js";
import {TYPE_STOCK} from "../storage/const.js";
import {Estado} from "../models/Estado.js";
import Sequelize from "sequelize";
import fetch from 'node-fetch'

class DevolucionController extends BaseController {
    static create = async (req, res) => {
        const {user, company} = req.headers
        const { body } = req
        const estados = await GrupoParametroRepository.getParametros('9e0ed3d9-435c-49b1-a67e-31052e08f012')
        const estadosSolicitudDevolucion = await GrupoParametroRepository.getParametros('fa7dc607-8e72-4644-ba00-962e2df265d2')
        const estadosDetalle = await GrupoParametroRepository.getParametros('910ed3d9-435c-49b1-a67e-31052e08f912')
        const articulos = body.detalle
        let transaction = await sequelize.transaction({
            autocommit: false,
            isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED
        })

        try {
            const detalleDespachoArray = []
            const detalleSolicitudArray = []
            const estadoDevolucion = articulos.every(articulo => Number(articulo.cantidad) === Number(articulo.cantidad_devolucion))

            const stockArrayPromises = []
            const historialDetalleEstados = []
            const detalle = articulos.map(item => {
                let index_estado
                let indexEstadoDetalle
                if (Number(item.cantidad) === Number(item.cantidad_devolucion)) {
                    index_estado = 1
                    indexEstadoDetalle = 1
                } else {
                    if (Number(item.cantidad_devolucion) === 0) {
                        index_estado = 3
                        indexEstadoDetalle = 5
                    } else {
                        index_estado = 2
                        indexEstadoDetalle = 0
                    }
                }

                stockArrayPromises.push(ProcesarStock({
                    IdTipoTransac: 'DEV',
                    Cantidad: item.cantidad_devolucion,
                    Tipo: 'DEVOLUCION',
                    UsuarioCreacion: user.username,
                    IdUsuario: user.id_user,
                    IdEmpresa: company.id,
                    IdAlmacenOrigen: item.id_almacen,
                    IdDetalleSolicitud: item.id,
                    IdNegocio: item.id_negocio,
                    IdArticulo: item.id_articulo,
                    ItemCode: item.codigo_producto,
                    ItemName: item.nombre_producto,
                    Devolucion: item.devolucion === 'SI' ? 'Y' : 'N',
                    Evaluacion: item.evaluacion === 'SI',
                    Grupo: item.grupo_articulo,
                    TransferStock: TYPE_STOCK.EN_EVALUACION,
                    transaction,
                }))

                detalleSolicitudArray.push(DetalleSolicitudArticuloRepository.update({
                    IdEstado: estadosDetalle[indexEstadoDetalle].id,
                    UsuarioModifica: user.username
                }, {
                    IdDetalleSocilitud: item.id
                }, transaction))

                historialDetalleEstados.push({
                    UsuarioCreacion: user.username,
                    IdDetalleSolicitud: item.id,
                    IdParametro: estadosDetalle[indexEstadoDetalle].id,
                })

                return {
                    ItemCode: item.codigo,
                    ItemName: item.descripcion,
                    SerialNumber: item.serie,
                    U_BPP_TIPUNMED: null,
                    Cantidad: item.cantidad_devolucion,
                    CantidadEntrega: item.cantidad_devolucion > 0 ? item.cantidad_devolucion : null,
                    PendienteDevolver: item.cantidad - item.cantidad_devolucion,
                    UsuarioCreacion: user.username,
                    IdDetalleSolicitud: item.id,
                    ComentarioMotivoDevolucion: item.comentario_motivo || null,
                    IdMotivoDevolucion: item.id_motivo || null,
                    IdEstadoEntrega: estados[index_estado].id
                }
            })

            await EstadoDetalle.bulkCreate(historialDetalleEstados, {transaction})
            const codigo = await DespachoSolicitudArticuloRepository.getCodigo('DEV')
            const responsableAlmacen = await UsuarioAlmacenRepository.buscarResponsableAlmacen(body.id_almacen)
            console.log('responsableAlmacen', responsableAlmacen)
            const cabecera = {
                Tipo: 'DEVOLUCION',
                Codigo: codigo,
                FechaProgramada: `${body.fecha_propuesta}`,
                Observacion: body.comentario || '',
                TipoTraslado: 0, // TODO: Se verá cuando hacemos traslado entre almacenes
                IdEstado: estados[estadoDevolucion ? 1 : 2].id,
                Cargo: '0', // TODO: cuando acepto el cargo actualizo este campo a 1 y se bloquea el detalle
                GuiaRemision: 'G',
                Atachment1: '',
                Atachment2: '',
                UsuarioCreacion: user.username,
                IdSocilitud: body.id,
                IdEmpresa: company.id,
                IdAlmacen: body.id_almacen,
                IdAsignado: body.id_asignado,
                IdResponsableAlmacen: responsableAlmacen?.idUsuario || null,
                ResponsableAlmacen: responsableAlmacen?.nombreUsuario || '',
                DetalleDespachoSolicituds: detalle,
            }

            await DespachoSolicitudArticuloRepository.create(cabecera, transaction)
            for (const action of stockArrayPromises) {
                await action.then();
            }

            await Promise.all(detalleSolicitudArray)
            await Promise.all(detalleDespachoArray)
            await transaction.commit()

            const faltaDevolver = await DetalleSolicitudArticuloRepository.faltaDevolver(body.id)
            await SolicitudArticuloRepository.update({
                params: {
                    IdEstado: faltaDevolver ? estadosSolicitudDevolucion[3].id : estadosSolicitudDevolucion[2].id,
                    UsuarioModifica: user.username
                },
                id: body.id
            })

            const estadoPendienteDevolucion = await Estado.findOne({
                where: {
                    Tipo: 'DEVOLUCION',
                    IdSocilitud: body.id,
                    IdParametro: 'ff7535f6-3274-4ab8-9976-5a45109048db'
                },
                raw: true
            })

            if (!estadoPendienteDevolucion && faltaDevolver) {
                await Estado.create({
                    Tipo: 'DEVOLUCION',
                    UsuarioCreacion: user.username,
                    IdSocilitud: body.id,
                    IdParametro: estadosSolicitudDevolucion[3].id,
                })
            }

            if (!faltaDevolver) {
                await Estado.create({
                    Tipo: 'DEVOLUCION',
                    UsuarioCreacion: user.username,
                    IdSocilitud: body.id,
                    IdParametro: estadosSolicitudDevolucion[2].id,
                })
            }

            return this.createdResponse(res)
        } catch (error) {
            if (transaction.finished !== 'commit')
                await transaction.rollback()
            return this.errorResponse(res, error)
        }
    }

    static notificarPorEmail = async (req, res) => {
        try {
            const { body } = req
            const { user } = req.headers
            const attachments = [
                {
                    filename: 'cargo-devolucion.pdf',
                    content: await generateAttachment(body, 'devolucion'),
                    encoding: 'base64'
                }
            ]

            await fetch(process.env.API_MAILING, {
                method: 'POST',
                body: JSON.stringify({
                    'email': user.correo,
                    'subject': 'DEVOLUCIÓN',
                    'template': 'devolucion.template',
                    'data': body,
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

export default DevolucionController
