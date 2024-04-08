import AlmacenRepository from "../repositories/AlmacenRepository.js";
import StockRepository from "../repositories/StockRepository.js";
import BaseController from "./BaseController.js";
import Util from "../utils/Util.js";
import {Ubigeo} from "../models/Ubigeo.js";
import path from "path";
import XLSX from "xlsx";
import {Op} from "sequelize";

class AlmacenController extends BaseController {
    static listar = async (req, res) => {
        try {
            const {company} = req.headers
            const pagination = Util.pagination(req)
            let data = null
            if (pagination) {
                pagination.filter.push(['Almacenes.IdEmpresa', 'eq', company.id])
                data = await AlmacenRepository.listarConPaginacion(pagination)
            } else {
                data = await AlmacenRepository.listar(company.id)
            }

            return this.successResponse(res, data)
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }

    static crear = async (req, res) => {
        try {
            const {user, company} = req.headers
            const { body } = req

            const existeAlmacen = await AlmacenRepository.existe(`${body.nombre}|${body.tipo}`, company.id)
            if (existeAlmacen) {
                return this.infoResponse(res, {
                    success: false,
                    message: 'Ya existe el almacén.',
                    data: existeAlmacen
                })
            }

            const ubigeo = await Ubigeo.findOne({where: { ubigeo_inei: body.ubigeo_inei }}).then(data => data.toJSON())

            const create = await AlmacenRepository.create({
                Nombre: body.nombre,
                Descripcion: body.descripcion,
                Direccion: body.direccion,
                Tipo: body.tipo,
                IdEmpresa: company.id,
                IdUbigeo: ubigeo.id_ubigeo,
                UsuarioCreacion: user.username
            })

            return this.createdResponse(res, {
                success: true,
                message: 'Registro exitoso',
                data: create
            })
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }

    static update = async (req, res) => {
        const {user, company} = req.headers
        try {
            const { body } = req

            const existeAlmacen = await AlmacenRepository.existeForUpdate(`${body.nombre}|${body.tipo}`, company.id, body.id)
            if (existeAlmacen) {
                return this.infoResponse(res, {
                    success: false,
                    message: 'Ya existe el almacén.',
                    data: existeAlmacen
                })
            }

            const ubigeo = await Ubigeo.findOne({where: { ubigeo_inei: body.ubigeo_inei }}).then(data => data.toJSON())
            const update = await AlmacenRepository.update({
                Nombre: body.nombre,
                Descripcion: body.descripcion,
                Direccion: body.direccion,
                Tipo: body.tipo,
                IdUbigeo: ubigeo.id_ubigeo,
                UsuarioModifica: user.username,
                FechaModifica: new Date()
            }, {
                IdAlmacen: body.id
            })

            return this.createdResponse(res, {
                success: true,
                message: 'Actualización exitosa',
                data: update
            })
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }

    static destroy = async (req, res) => {
        const {user} = req.headers
        const {id} = req.params
        try {
            const almacen = await AlmacenRepository.buscarPorId(id)

            const tieneStock = await StockRepository.buscarPorAlmacen(id)
            if (tieneStock && tieneStock.cantidad > 0) {
                return this.infoResponse(res, {
                    message: 'El Almacén tiene productos con stock.',
                })
            }

            const destroy = AlmacenRepository.update({
                Activo: !almacen.Activo,
                UsuarioModifica: user.username,
                FechaModifica: new Date(),
            }, { IdAlmacen: id })
            return this.createdResponse(res, {
                success: true,
                message: `Registro ${almacen.Activo ? 'eliminado' : 'activado'}.`,
                data: destroy
            })
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }

    static importData = async (req, res) => {
        const {user, company} = req.headers

        try {
            let almacenes = []
            let almacenesSuccess = []
            let almacenesErrors = []
            if (req.files) {
                almacenes = await Util.readExcel(req.files)

                almacenes = almacenes.reduce((previousValue, currentValue) => {
                    if (previousValue.find(almacen => almacen.Nombre === currentValue.Nombre && almacen.Tipo === currentValue.Tipo)) {
                        currentValue.errores = currentValue.errores ?? []
                        currentValue.errores.push('El almacén se repite en el excel.')
                    }
                    previousValue.push(currentValue)
                    return previousValue
                }, [])

                const textSearchExist = almacenes.map(almacen => `${almacen.Nombre}|${almacen.Tipo}`)
                const almacenesExistentes = await AlmacenRepository.almacenesExistentes(textSearchExist, company.id)
                almacenes.filter(almacen => almacenesExistentes.find(item => item.Nombre === almacen.Nombre && item.Tipo === almacen.Tipo)).map(item => {
                    item.errores = item.errores ?? []
                    item.errores.push('El almacén ya existe en el sistema.')
                    return item
                })

                const codigos = almacenes.map(almacen => almacen.Ubigeo)
                const ubigeos = await Ubigeo.findAll({ where: { ubigeo_inei: {[Op.in]: codigos} }, raw: true })
                almacenes = almacenes.map(almacen => {
                    const ubigeo = ubigeos.find(ubigeo => parseInt(ubigeo.ubigeo_inei) === parseInt(almacen.Ubigeo))
                    if (!ubigeo) {
                        almacen.errores = almacen.errores ?? []
                        almacen.errores.push('El código de ubigeo no es existe.')
                    } else {
                        almacen.IdEmpresa = company.id
                        almacen.IdUbigeo = ubigeo.id_ubigeo
                        almacen.UsuarioCreacion = user.username
                    }
                    return almacen
                })

                const tipos = ['ALMACEN', 'PDV']
                almacenes.filter(almacen => !almacen.Tipo || !tipos.includes(almacen.Tipo.toUpperCase())).map(item => {
                    item.errores = item.errores ?? []
                    item.errores.push('El tipo no existe.')
                    return item
                })

                almacenesSuccess = almacenes.filter(almacen => !almacen.errores)
                almacenesErrors = almacenes.filter(almacen => almacen.errores)

                console.log('almacenesSuccess', almacenesSuccess)
                console.log('almacenesErrors', almacenesErrors)

                await AlmacenRepository.bulkCreate(almacenesSuccess)

                if (almacenesErrors.length > 0) {
                    return this.infoResponse(res, {
                        success: false,
                        message: 'Archivo con errores.',
                        data: {
                            almacenesSuccess: almacenesSuccess.length,
                            almacenesErrors: almacenesErrors,
                        }
                    })
                }

                return this.successResponse(res, {
                    success: true,
                    message: 'Importación correcta.',
                    data: almacenesSuccess
                })
            }
            return this.infoResponse(res, {
                success: false,
                message: 'No existe el archivo.'
            })

        } catch (error) {
            return this.errorResponse(res, error)
        }
    }
}

export default AlmacenController
