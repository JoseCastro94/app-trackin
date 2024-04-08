import DetalleSolicitudArticuloRepository from "../repositories/DetalleSolicitudArticuloRepository.js";
import SolicitudArticuloRepository from "../repositories/SolicitudArticuloRepository.js";
import UsuarioNegocioRepository from "../repositories/UsuarioNegocioRepository.js";
import BaseController from "./BaseController.js";
import UsuarioAlmacenRepository from "../repositories/UsuarioAlmacenRepository.js";

class SolicitudArticuloController extends BaseController {
    static list = async (req, res) => {
        try {
            const {user, company} = req.headers
            const {estado = ['1ba55dc8-3d0a-4c09-933e-7b5aabc70d60','3f2eae4c-11e9-4edf-86f7-04f6bb6fddf6','4d43c52b-7858-4156-a537-d41d092c3399']} = req.query
            
            const almacenes = await UsuarioAlmacenRepository.listarPorId(user.id_user)
            const IdAlmacenes = almacenes.map(almacen => almacen.id)
            const data = await SolicitudArticuloRepository.list(estado, company.id, IdAlmacenes)
            return this.successResponse(res, data)
        } catch (e) {
            return this.errorResponse(res, e)
        }
    }

    static listarSolicitudesConDetalle = async (req, res) => {
        try {
            const {solicitudes} = req.body;
            let data = []
            if (solicitudes.length > 0) {
                const {user, company} = req.headers
                const almacenes = await UsuarioAlmacenRepository.listarPorId(user.id_user)
                const IdAlmacenes = almacenes.map(almacen => almacen.id)

                data = await SolicitudArticuloRepository.listarSolicitudesPorId(solicitudes, company.id, IdAlmacenes)
                const arrayPromises = data.map(item => UsuarioNegocioRepository.listarPorId(item.id))
                const arrayDetallePromises = data.map(item => DetalleSolicitudArticuloRepository.listarPorIdSolicitud(item.id, company.id, IdAlmacenes))
                const responsePromiseAll = await Promise.all(arrayPromises);
                const responseDetallePromiseAll = await Promise.all(arrayDetallePromises);
                data = data.map((item, index) => {
                    const asignados = responsePromiseAll[index]
                    asignados.unshift({ id: 'TODOS', nombre: 'Todos' })
                    item.asignados = asignados
                    item.detalle = responseDetallePromiseAll[index]
                    return item
                })
            }
            console.log('ESTO: ', data)

            return this.successResponse(res, data)
        } catch (e) {
            return this.errorResponse(res, e)
        }
    }

    static listarDevoluciones = async (req, res) => {
        try {
            const {user, company} = req.headers
            const {estado = null} = req.query
            const almacenes = await UsuarioAlmacenRepository.listarPorId(user.id_user)
            const IdAlmacenes = almacenes.map(almacen => almacen.id)
            let data = await SolicitudArticuloRepository.listarDevoluciones(estado, company.id, IdAlmacenes)
            return this.successResponse(res, data);
        } catch (e) {
            return this.errorResponse(res, e)
        }
    }

    static listarDevolucionesConDetalle = async (req, res) => {
        try {
            const {solicitudes} = req.body;
            const {user, company} = req.headers
            const almacenes = await UsuarioAlmacenRepository.listarPorId(user.id_user)
            const IdAlmacenes = almacenes.map(almacen => almacen.id)

            let data = await SolicitudArticuloRepository.listarSolicitudesPorId(solicitudes, company.id, IdAlmacenes, 'DEVOLUCION')
            const arrayDetallePromises = data.map(item => DetalleSolicitudArticuloRepository.listarDevolucionPorIdSolicitud(item.id, company.id, IdAlmacenes))
            const responseDetallePromiseAll = await Promise.all(arrayDetallePromises);
            const arrayPromises = data.map(item => UsuarioNegocioRepository.listarPorId(item.id))
            const responsePromiseAll = await Promise.all(arrayPromises);
            data = data.map((item, index) => {
                item.asignados = responsePromiseAll[index]
                item.detalle = responseDetallePromiseAll[index]
                return item
            })
            return this.successResponse(res, data);
        } catch (e) {
            return this.errorResponse(res, e)
        }
    }

    static listarEstados = async (req, res) => {
        try {
            const {user, company} = req.headers
            const { tipo } = req.query
            const almacenes = await UsuarioAlmacenRepository.listarPorId(user.id_user)
            const IdAlmacenes = almacenes.map(almacen => almacen.id)

            const data = await SolicitudArticuloRepository.listarEstados(tipo, company.id, IdAlmacenes)
            return this.successResponse(res, data);
        } catch (e) {
            return this.errorResponse(res, e)
        }
    }
}

export default SolicitudArticuloController
