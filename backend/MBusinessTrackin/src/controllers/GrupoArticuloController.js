import GrupoArticuloRepository from "../repositories/GrupoArticuloRepository.js";
import ArticuloRepository from "../repositories/ArticuloRepository.js";
import BaseController from "./BaseController.js";
import Util from "../utils/Util.js";
import {sequelize} from "../database/database.js";
import Sequelize from "sequelize";

class GrupoArticuloController extends BaseController {
    static listar = async (req, res) => {
        try {
            const {company} = req.headers
            const data = await GrupoArticuloRepository.listar(company.id)
            return this.successResponse(res, data)
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }

    static listarPaginacion = async (req, res) => {
        try {
            const {company} = req.headers
            const pagination = Util.pagination(req)
            pagination.filter.push(['GrupoArticulos.IdEmpresa', 'eq', company.id])
            const data = await GrupoArticuloRepository.listWithPagination(pagination)
            return this.successResponse(res, data)
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }

    static crear = async (req, res) => {
        try {
            const {user, company} = req.headers
            const data = {...req.body, UsuarioCreacion: user.username, IdEmpresa: company.id}
            const exist = await GrupoArticuloRepository.buscarPorNombre(data.Nombre)

            if (exist) {
                return this.infoResponse(res, {
                    success: false,
                    message: 'Ya existe el grupo artículo.',
                    data: exist
                })
            }

            const create = GrupoArticuloRepository.create(data)
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
        try {
            const {user} = req.headers
            const {id} = req.params
            const data = {...req.body, UsuarioModifica: user.username, FechaCreacion: new Date()}
            delete data.id
            delete data.Activo

            /* const exist = await GrupoArticuloRepository.buscarPorNombre(data.Nombre, id)

            if (exist) {
                return this.infoResponse(res, {
                    success: false,
                    message: 'Ya existe el grupo artículo.',
                    data: exist
                })
            } */

            const update = GrupoArticuloRepository.update(data, {
                IdGrupoArticulo: id
            })
            return this.createdResponse(res, {
                success: true,
                message: 'Actualización exitoso',
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
            const articulos = await ArticuloRepository.buscarPorIdGrupoArticulo(id)

            if (articulos.length > 0) {
                return this.infoResponse(res, {
                    message: 'No se puede eliminar el grupo porque existen artículos que lo tienen configurado.',
                })
            }

            const grupo = await GrupoArticuloRepository.buscarPorId(id)

            const destroy = GrupoArticuloRepository.update({
                Activo: !grupo.Activo,
                UsuarioModifica: user.username,
                FechaModifica: new Date(),
            }, {
                IdGrupoArticulo: id
            })
            return this.createdResponse(res, {
                success: true,
                message: `Registro ${grupo.Activo ? 'eliminado' : 'activado'}.`,
                data: destroy
            })
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }

    static importData = async (req, res) => {
        const {user, company} = req.headers

        let transaction = await sequelize.transaction({
            autocommit: false,
            isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED
        })

        try {
            let grupoArticulos = []
            let grupoArticulosSuccess = []
            let grupoArticulosErrors = []
            if (req.files) {
                grupoArticulos = await Util.readExcel(req.files)
                const siNo = ['SI', 'NO']

                grupoArticulos = grupoArticulos.reduce((previousValue, currentValue) => {
                    if (previousValue.find(grupo => grupo.Nombre === currentValue.Nombre)) {
                        currentValue.errores = currentValue.errores ?? []
                        currentValue.errores.push('El nombre de grupo se repite en el excel.')
                    }
                    previousValue.push(currentValue)
                    return previousValue
                }, [])

                let nombreGrupos = grupoArticulos.map(grupo => grupo.Nombre || '')
                nombreGrupos = [...new Set(nombreGrupos)]
                const gruposExistentes = await GrupoArticuloRepository.buscarPorNombres(nombreGrupos, company.id)
                grupoArticulos.filter(grupo => gruposExistentes.find(item => item.Nombre === grupo.Nombre)).map(grupo => {
                    grupo.errores = grupo.errores ?? []
                    grupo.errores.push('El grupo ya existe en el sistema.')
                    return grupo
                })

                grupoArticulos.filter(grupo => !grupo.Nombre).map(grupo => {
                    grupo.errores = grupo.errores ?? []
                    grupo.errores.push('Nombre es requerido.')
                    return grupo
                })

                grupoArticulos.filter(grupo => !grupo.AplicaDevolucion).map(grupo => {
                    grupo.errores = grupo.errores ?? []
                    grupo.errores.push('AplicaDevolucion es requerido.')
                    return grupo
                })

                grupoArticulos.filter(grupo => grupo.DiasDevolucion !== 0 && !grupo.DiasDevolucion ).map(grupo => {
                    grupo.errores = grupo.errores ?? []
                    grupo.errores.push('DiasDevolucion es requerido.')
                    return grupo
                })

                grupoArticulos.filter(grupo => grupo.DiasDevolucion !== 0 && !parseInt(grupo.DiasDevolucion)).map(item => {
                    item.errores = item.errores ?? []
                    item.errores.push('DiasDevolucion debe ser un número.')
                    return item
                })

                grupoArticulos.filter(grupo => !grupo.AplicaEvaluacion).map(grupo => {
                    grupo.errores = grupo.errores ?? []
                    grupo.errores.push('AplicaEvaluacion es requerido.')
                    return grupo
                })

                grupoArticulos.filter(grupo => !grupo.TieneSerie).map(grupo => {
                    grupo.errores = grupo.errores ?? []
                    grupo.errores.push('TieneSerie es requerido.')
                    return grupo
                })

                grupoArticulos.filter(grupo => !siNo.includes(grupo.AplicaDevolucion)).map(grupo => {
                    grupo.errores = grupo.errores ?? []
                    grupo.errores.push('AplicaDevolucion Solo se acepta SI o NO.')
                    return grupo
                })

                grupoArticulos.filter(grupo => !siNo.includes(grupo.AplicaEvaluacion)).map(grupo => {
                    grupo.errores = grupo.errores ?? []
                    grupo.errores.push('AplicaEvaluacion Solo se acepta SI o NO.')
                    return grupo
                })

                grupoArticulos.filter(grupo => !siNo.includes(grupo.TieneSerie)).map(grupo => {
                    grupo.errores = grupo.errores ?? []
                    grupo.errores.push('TieneSerie Solo se acepta SI o NO.')
                    return grupo
                })

                /*
                const empresas = grupoArticulos.map(grupo => grupo.Empresa || '')
                const empresasExistentes = await EmpresaRepository.buscarPorNombres(empresas)
                grupoArticulos.map(grupo => {
                    const empresa = empresasExistentes.find(item => item.RazonSocial === grupo.Empresa)
                    if (!empresa) {
                        grupo.errores = grupo.errores ?? []
                        grupo.errores.push('La empresa no existe en el sistema.')
                    } else {
                        grupo.IdEmpresa = empresa.IdEmpresa
                        grupo.UsuarioCreacion = user.username
                    }
                    return grupo
                })
                */

                grupoArticulosSuccess = grupoArticulos.filter(grupo => !grupo.errores)
                grupoArticulosErrors = grupoArticulos.filter(grupo => grupo.errores)

                grupoArticulosSuccess = grupoArticulosSuccess.map(grupo => {
                    grupo.U_DiasEntrega = grupo.DiasDevolucion
                    grupo.U_Devolucion = grupo.AplicaDevolucion === 'SI' ? 'Y' : 'N'
                    grupo.U_Evaluacion = grupo.AplicaEvaluacion === 'SI' ? 'Y' : 'N'
                    grupo.TieneSerie = grupo.TieneSerie === 'SI'
                    grupo.IdEmpresa = company.id
                    grupo.UsuarioCreacion = user.username
                    return grupo
                })

                if (grupoArticulosSuccess.length > 0)
                    await GrupoArticuloRepository.bulkCreate(grupoArticulosSuccess, transaction)

                await transaction.commit()
                if (grupoArticulosErrors.length > 0) {
                    return this.infoResponse(res, {
                        success: false,
                        message: 'Archivo con errores.',
                        data: {
                            grupoArticulosSuccess: grupoArticulosSuccess.length,
                            grupoArticulosErrors: grupoArticulosErrors
                        }
                    })
                }


                return this.successResponse(res, {
                    success: true,
                    message: 'Importación correcta.',
                    data: {
                        grupoArticulosSuccess
                    }
                })
            }
            return this.infoResponse(res, {
                success: false,
                message: 'No existe el archivo.'
            })
        } catch (error) {
            await transaction.rollback()
            return this.errorResponse(res, error)
        }
    }
}

export default GrupoArticuloController
