import DetalleDespachoSolicitudArticuloRepository from "../repositories/DetalleDespachoSolicitudArticuloRepository.js";
import DespachoSolicitudArticuloRepository from "../repositories/DespachoSolicitudArticuloRepository.js";
import DetalleSolicitudArticuloRepository from "../repositories/DetalleSolicitudArticuloRepository.js";
import SolicitudArticuloRepository from "../repositories/SolicitudArticuloRepository.js";
import TransacAlmacenRepository from "../repositories/TransacAlmacenRepository.js";
import GrupoParametroRepository from "../repositories/GrupoParametroRepository.js";
import UsuarioAlmacenRepository from "../repositories/UsuarioAlmacenRepository.js";
import {EstadoDetalle} from "../models/EstadoDetalle.js";
import {ProcesarStock} from "../operations/stocks.js";
import {sequelize} from "../database/database.js";
import BaseController from "./BaseController.js";
import {Estado} from "../models/Estado.js";
import Sequelize from "sequelize";
import fetch from "node-fetch";

class DespachoSolicitudController extends BaseController {
    static listar = async (req, res) => {
        const {user, company} = req.headers
        const almacenes = await UsuarioAlmacenRepository.listarPorId(user.id_user)
        const IdAlmacenes = almacenes.map(almacen => almacen.id)
        const { tipo = 'DESPACHO', fechaIni, fechaFin, filtro, estado } = req.query

        try {
            /*
            console.log('demops man')
            const demo = await DespachoSolicitudArticuloRepository.listarDespachosSolicitudes({
                IdEmpresa: company.id, IdAlmacenes, fechaIni, fechaFin, estado, filtro
            })
            console.log('DATA--DEMO', demo)
            */
           console.dir('metodo listar');
            let data = [];
            if (IdAlmacenes.length > 0) {
                data = await DespachoSolicitudArticuloRepository.listar(tipo, company.id, IdAlmacenes, fechaIni, fechaFin, filtro, estado)
                console.log('data', data)
                const arrayPromise = data.map(item => DetalleDespachoSolicitudArticuloRepository.listarDetalleDespachoSolicitud(item.id, tipo, company.id, IdAlmacenes))
                console.log('arrayPromise', arrayPromise)
                const detalles = await Promise.all(arrayPromise)
                console.log('detalles', JSON.stringify(detalles))
                data = data.map((item, index) => {
                    item.detalle = detalles[index]
                    return item
                })
            }
            return this.successResponse(res, data)
        } catch (e) {
            return this.errorResponse(res, e)
        }
    }

    static create = async (req, res) => {
        const {user, company} = req.headers
        const { body } = req
        const estados = await GrupoParametroRepository.getParametros('9e0ed3d9-435c-49b1-a67e-31052e08f912')
        let transaction = await sequelize.transaction({
            autocommit: false,
            isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED
        })

        const articulos = body.detalle.filter(item => item.picking > 0)

        if (articulos.length === 0) {
            return this.successResponse(res, {
                success: false,
                message: 'No hay datos para procesar.'
            })
        }

        const buscarStocks = articulos.map(item =>
            TransacAlmacenRepository.buscarStock(
                item.id,
                item.id_articulo,
                item.id_almacen,
                item.id_negocio,
                'COMPROMETIDO')
        )

        const detalle = articulos.map(item => {
            return {
                ItemCode: item.codigo,
                ItemName: item.item,
                U_BPP_TIPUNMED: null,
                CantidadPicking: item.picking,
                UsuarioCreacion: user.username,
                IdDetalleSolicitud: item.id,
                IdEstadoEntrega: estados[1].id
            }
        })

        for(const item of detalle) {
            await DetalleSolicitudArticuloRepository.incrementCantidadDespachado(item.IdDetalleSolicitud, item.CantidadPicking, transaction)
        }

        const buscarStocksPromise = await Promise.all(buscarStocks)
        const productosSinStock = articulos.map((item, index) => {
            item.stock_actual = buscarStocksPromise[index].cantidad
            return item
        }).filter(item => item.stock_actual < item.picking)

        if (productosSinStock.length > 0) {
            return this.successResponse(res, {
                success: false,
                message: 'Productos sin stock',
                data: productosSinStock
            })
        }
        const codigo = await DespachoSolicitudArticuloRepository.getCodigo()
        const responsableAlmacen = await UsuarioAlmacenRepository.buscarResponsableAlmacen(body.almacen.id)
        const cabecera = {
            Codigo: codigo,
            FechaProgramada: `${body.fecha_despacho}`,
            Observacion: body.comentario,
            TipoTraslado: 0, // TODO: Se verá cuando hacemos traslado entre almacenes
            IdEstado: '96cf2544-a507-4ff1-b7b1-174a1e158dd0',
            Cargo: '0', // TODO: cuando acepto el cargo actualizo este campo a 1 y se bloquea el detalle
            GuiaRemision: 'G',
            Atachment1: '',
            Atachment2: '',
            UsuarioCreacion: user.username,
            IdSocilitud: body.id,
            IdEmpresa: company.id,
            IdAlmacen: body.almacen.id,
            IdAsignado: body.id_asignado,
            IdResponsableAlmacen: responsableAlmacen?.idUsuario || null,
            ResponsableAlmacen: responsableAlmacen?.nombreUsuario || '',
            DetalleDespachoSolicituds: detalle
        }

        try {
            const despacho = await DespachoSolicitudArticuloRepository.create(cabecera, transaction)
            const transac = despacho.DetalleDespachoSolicituds.map(item => {
                let articulo = articulos.find(articulo => articulo.id === item.IdDetalleSolicitud)
                return ProcesarStock({
                    IdTipoTransac: 'DESP',
                    ItemCode: item.ItemCode,
                    ItemName: item.ItemName,
                    Cantidad: item.CantidadPicking,
                    Tipo: 'PICKPACK',
                    UsuarioCreacion: user.username,
                    IdUsuario: user.id_user,
                    IdEmpresa: company.id,
                    IdAlmacenOrigen: articulo.id_almacen,
                    IdDetalleSolicitud: item.IdDetalleSolicitud,
                    IdDetalleDespacho: item.IdDetalleDespacho,
                    IdNegocio: articulo.id_negocio,
                    IdArticulo: articulo.id_articulo,
                    Grupo: articulo.categoria,
                    Devolucion: articulo.devolucion,
                    transaction
                })
            })
            await Promise.all(transac)
            await SolicitudArticuloRepository.update({
                params: {
                    IdEstado: '3f2eae4c-11e9-4edf-86f7-04f6bb6fddf6',
                    UsuarioModifica: user.username
                },
                id: body.id
            }, transaction)
            const historialDetalleEstados = []
            const updateEstadoDetalleSolicitudPromise = articulos.filter(item => item.cantidad_entrega === 0).map(item =>{
                historialDetalleEstados.push({
                    UsuarioCreacion: user.username,
                    IdDetalleSolicitud: item.id,
                    IdParametro: '99cf2544-a507-4ff1-b7b1-174a1e158dd0',
                })
                return DetalleSolicitudArticuloRepository.update({
                        IdEstado: '99cf2544-a507-4ff1-b7b1-174a1e158dd0',
                        UsuarioModifica: user.username
                    }, {
                        IdDetalleSocilitud: item.id
                    },
                    transaction
                )
            })
            await Estado.create({
                Tipo: 'PEDIDO',
                UsuarioCreacion: user.username,
                IdSocilitud: body.id,
                IdParametro: '3f2eae4c-11e9-4edf-86f7-04f6bb6fddf6',
            }, { transaction })
            await EstadoDetalle.bulkCreate(historialDetalleEstados, {transaction})
            await Promise.all(updateEstadoDetalleSolicitudPromise)
            await transaction.commit()
            const data = await DespachoSolicitudArticuloRepository.findById(despacho.IdDespacho)
            await fetch(process.env.API_MAILING, {
                method: 'POST',
                body: JSON.stringify({
                    'email': user.correo,
                    'subject': 'PEDIDO ARTÍCULOS',
                    'template': 'picking.template',
                    'data': data
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return this.createdResponse(res, {
                success: true,
                message: 'Registro exitoso',
                data: despacho
            })
        } catch (error) {
            console.log('transaction', transaction)
            if (transaction.finished !== 'commit')
                await transaction.rollback()
            return this.errorResponse(res, error)
        }
    }

    static createDevolucion = async (req, res) => {
        const {user, company} = req.headers
        const { body } = req
        let transaction = await sequelize.transaction({
            autocommit: false,
            isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED
        })

        const articulos = body.detalle.filter(item => item.picking > 0)

        if (articulos.length === 0) {
            return this.successResponse(res, {
                success: false,
                message: 'No hay datos para procesar.'
            })
        }

        const detalle = articulos.map(item => {
            return {
                ItemCode: item.codigo,
                ItemName: item.item,
                U_BPP_TIPUNMED: null,
                Cantidad: item.picking,
                UsuarioCreacion: user.username,
                IdDetalleSolicitud: item.id
            }
        })

        const cabecera = {
            FechaProgramada: `${body.fecha_despacho}`,
            Observacion: body.comentario,
            TipoTraslado: 0, // TODO: Se verá cuando hacemos traslado entre almacenes
            IdEstado: 'ff7535f6-3274-4ab8-9973-5a45109048db',
            Cargo: '0', // TODO: cuando acepto el cargo actualizo este campo a 1 y se bloquea el detalle
            GuiaRemision: 'G',
            Atachment1: '',
            Atachment2: '',
            Tipo: 'DEVOLUCION',
            UsuarioCreacion: user.username,
            IdSocilitud: body.id,
            IdEmpresa: company.id,
            IdAlmacen: body.id_almacen,
            IdAsignado: body.id_asignado,
            DetalleDespachoSolicituds: detalle
        }

        try {
            const despacho = await DespachoSolicitudArticuloRepository.create(cabecera, transaction)
            //TODO: Actualizar en Solicitud al estado = '3f2eae4c-11e9-4edf-86f7-04f6bb6fddf6'
            await SolicitudArticuloRepository.update({
                params: {
                    IdEstado: 'ff7535f6-3274-4ab8-9976-5a45109048db',
                    UsuarioModifica: user.username
                },
                id: body.id
            }, transaction)
            //TODO: Actualizar en Detalle solicitud el estado que es el picking mayor a 0 y entregado = 0 con el estado '99cf2544-a507-4ff1-b7b1-174a1e158dd0'
            const updateEstadoDetalleSolicitudPromise = body.detalle.filter(item => item.picking > 0 || item.cantidad_entrega > 0).map(item =>
                DetalleSolicitudArticuloRepository.update({
                        IdEstado: 'ff7535f6-3274-4ab8-9973-5a45109048db',
                        UsuarioModifica: user.username
                    }, {
                        IdDetalleSocilitud: item.id
                    },
                    transaction
                )
            )
            await Promise.all(updateEstadoDetalleSolicitudPromise)
            await transaction.commit()
            return this.createdResponse(res, {
                success: true,
                message: 'Registro exitoso',
                data: despacho
            })
        } catch (error) {
            await transaction.rollback()
            return this.errorResponse(res, error)
        }
    }

    static listarDetalle = async (req, res) => {
        try {
            const {id_despacho} = req.params
            const data = await DetalleDespachoSolicitudArticuloRepository.listar(id_despacho)
            return this.successResponse(res, data)
        } catch (e) {
            return this.errorResponse(res, e)
        }
    }
}

export default DespachoSolicitudController
