import DetalleSolicitudArticuloRepository from "../repositories/DetalleSolicitudArticuloRepository.js";
import SolicitudArticuloRepository from "../repositories/SolicitudArticuloRepository.js";
import UsuarioNegocioRepository from "../repositories/UsuarioNegocioRepository.js";
import BaseController from "./BaseController.js";
import UsuarioAlmacenRepository from "../repositories/UsuarioAlmacenRepository.js";
import SolicitudTransferenciaRepository from "../repositories/SolicitudTransferenciaRepository.js";
import DetalleSolicitudTransferenciaRepository from "../repositories/DetalleSolicitudTransferenciaRepository.js";

class SolicitudTransferenciaController extends BaseController {
    static list = async (req, res) => {
        try {
            const {user, company} = req.headers
            console.dir('------------------');

            console.dir('ESTADO: ' + req.query.estado);
            console.dir(req.query);
            console.dir('------------------');

            const {estado = ['1ba55dc8-3d0a-4c09-933e-7b5aabc70d60','3f2eae4c-11e9-4edf-86f7-04f6bb6fddf6','4d43c52b-7858-4156-a537-d41d092c3399','4dabb637-f9f3-43d9-bfc8-f95f17450e17']} = req.query
            console.dir('LISTA DE ESTADO:::');
            console.dir(estado);
            const almacenes = await UsuarioAlmacenRepository.listarPorId(user.id_user)

            const IdAlmacenes = almacenes.map(almacen => almacen.id)
           
            const data = await SolicitudTransferenciaRepository.list(estado, company.id, IdAlmacenes)

        
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
                console.log('almacen')
             
                console.dir(' company.id: ' +  company.id);
                console.dir(' IdAlmacenes: ' + IdAlmacenes);
                data = await SolicitudTransferenciaRepository.listarSolicitudesPorId(solicitudes, company.id, IdAlmacenes)
                console.dir('data');
                console.dir(data);
                const arrayPromises = data.map(item => UsuarioNegocioRepository.listarUsuarioTransferenciaPorId(item.id))
               
                console.dir('arrayPromises');
                console.dir(arrayPromises);
                const arrayDetallePromises = data.map(item => DetalleSolicitudTransferenciaRepository.listarPorIdSolicitud(item.id, company.id, IdAlmacenes))
                console.dir('arrayDetallePromises');
                console.dir(arrayDetallePromises);

                const responsePromiseAll = await Promise.all(arrayPromises);
                const responseDetallePromiseAll = await Promise.all(arrayDetallePromises);
                data = data.map((item, index) => {
                    const asignados = responsePromiseAll[index]
                    asignados.unshift({ id: 'TODOS', nombre: 'Todos' })
                    item.asignados = asignados
                    item.detalle = responseDetallePromiseAll[index]
                   
                    return item
                })

                console.dir('FIN SALIDA');
            }
            console.log('ESTO: ')
            console.dir(data);
           
            console.dir('detalle');
            if( data.detalle != undefined &&  data.detalle != null){
                for(const item of data.detalle){
                    console.dir(item);
                }
               
            }else{
                console.dir('data.detalle es undefined');
            }
           
          
           
            /*
             console.dir('ASIGANDOS');
             for(const item of data.asignados){
                console.dir(item);
            }
            */
            return this.successResponse(res, data)
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

            const data = await SolicitudTransferenciaRepository.listarEstados(tipo, company.id, IdAlmacenes)
            return this.successResponse(res, data);
        } catch (e) {
            return this.errorResponse(res, e)
        }
    }

    static rechazarSolicitud = async (req, res) => {
        try {
            const { idSolicitud } = req.query
            const result = await SolicitudTransferenciaRepository.rechazarSolicitudTransferencia(idSolicitud);
            const data = {'data': result};
            return this.successResponse(res, data);
        } catch (e) {
            return this.errorResponse(res, e)
        }
    }

    
    static aprobarPendienteAprobacion = async (req, res) => {
        try {
           const idEstadoProgramar = '1ba55dc8-3d0a-4c09-933e-7b5aabc70d60';
        // const idEstadoProgramar = '4dabb637-f9f3-43d9-bfc8-f95f17450e17';
            const {user, company} = req.headers;
            const { idSolicitud } = req.body;
            console.dir('aprobarPendienteAprobacion');
            console.dir(user);
            const result = await SolicitudTransferenciaRepository.aprobarPendienteAprobacion(idSolicitud,idEstadoProgramar,user.username);
       
            const data = {'data': result};
            return this.successResponse(res, data);
        } catch (e) {
            return this.errorResponse(res, e)
        }
    }
}

export default SolicitudTransferenciaController
