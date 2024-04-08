import UsuarioNegocioRepository from "../repositories/UsuarioNegocioRepository.js";
import TipoNegocioRepository from "../repositories/TipoNegocioRepository.js";
import EmpresaRepository from "../repositories/EmpresaRepository.js";
import BaseController from "./BaseController.js";
import Util from "../utils/Util.js";

class TipoNegocioController extends BaseController {
    static listar = async (req, res) => {
        try {
            const {company} = req.headers
            const pagination = Util.pagination(req)
            let data = null
            if (pagination) {
                pagination.filter.push(['IdEmpresa', 'eq', company.id])
                data = await TipoNegocioRepository.listarConPaginacion(pagination)
            } else {
                data = await TipoNegocioRepository.listar(company.id)
            }

            return this.successResponse(res, data)
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }

    static listarArticulos = async (req, res) => {
        try {
            const {company} = req.headers
            const pagination = Util.pagination(req)
            let data = null
            
            if (pagination) {
                pagination.filter.push(['`TipoNegocio`.`IdEmpresa`', 'eq', company.id])
                data = await TipoNegocioRepository.listarArticuloConPaginacion(pagination)
            } else {
                data = await TipoNegocioRepository.listarArticulos(company.id)
            }

            return this.successResponse(res, data)
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }
    

    static listarNegociosConEmpresa = async (req, res) => {
        try {
            const pagination = Util.pagination(req)
            const data = await TipoNegocioRepository.listarNegociosConEmpresa(pagination)
            return this.successResponse(res, data)
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }

    static crear = async (req, res) => {
        try {
            const {user} = req.headers
            const data = {...req.body, UsuarioCreacion: user.username}
            const create = await TipoNegocioRepository.create(data)
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
            const data = {...req.body, UsuarioModifica: user.username, FechaModifica: new Date()}
            const {id} = req.params
            const update = await TipoNegocioRepository.update(data, {
                IdNegocio: id
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
            const usuarios = await UsuarioNegocioRepository.buscarPorIdNegocio(id)

            if (usuarios.length > 0) {
                return this.infoResponse(res, {
                    message: 'El Negocio tiene usuarios asignados.',
                })
            }

            const negocio = await TipoNegocioRepository.buscarPorId(id)
            const destroy = await TipoNegocioRepository.update({
                Activo: !negocio.Activo,
                UsuarioModifica: user.username,
                FechaModifica: new Date(),
            }, {
                IdNegocio: id
            })

            return this.createdResponse(res, {
                success: true,
                message: `Registro ${negocio.Activo ? 'eliminado' : 'activado'}.`,
                data: destroy
            })
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }

    static importData = async (req, res) => {
        const {user, company} = req.headers

        try {
            let negocios = []
            let negociosSuccess = []
            let negociosErrors = []
            if (req.files) {
                negocios = await Util.readExcel(req.files)
                negocios = negocios.reduce((previousValue, currentValue) => {
                    if (previousValue.find(negocio => negocio.Nombre === currentValue.Nombre)) {
                        currentValue.errores = currentValue.errores ?? []
                        currentValue.errores.push('La empresa se repite en el excel.')
                    }
                    previousValue.push(currentValue)
                    return previousValue
                }, [])

                negocios.filter(negocio => !negocio.Nombre).map(negocio => {
                    negocio.errores = negocio.errores ?? []
                    negocio.errores.push('Nombre es requerido.')
                    return negocio
                })

                negocios.filter(negocio => !negocio.Empresa).map(negocio => {
                    negocio.errores = negocio.errores ?? []
                    negocio.errores.push('Empresa es requerido.')
                    return negocio
                })

                let empresas = negocios.map(negocio => negocio.Empresa || '')
                empresas = [...new Set(empresas)]
                const empresasExistentes = await EmpresaRepository.buscarPorNombres(empresas)
                negocios.map(negocio => {
                    const empresa = empresasExistentes.find(item => item.RazonSocial === negocio.Empresa)
                    if (!empresa) {
                        negocio.errores = negocio.errores ?? []
                        negocio.errores.push('La empresa no existe en el sistema.')
                    } else {
                        negocio.IdEmpresa = empresa.IdEmpresa
                        negocio.UsuarioCreacion = user.username
                        negocio.Tipo = 1
                        negocio.SubTipo = 1
                    }
                    return negocio
                })

                let nombresNegocios = negocios.map(negocio =>`${negocio.Nombre}|${negocio.Empresa}`)
                nombresNegocios = [...new Set(nombresNegocios)]
                console.log('nombresNegocios', nombresNegocios)
                const negociosExistentes = await TipoNegocioRepository.buscarPorNombresAndEmpresa(nombresNegocios)
                console.log('negociosExistentes', negociosExistentes)
                negocios.filter(negocio => negociosExistentes.find(item => item.Nombre === negocio.Nombre)).map(negocio => {
                    negocio.errores = negocio.errores ?? []
                    negocio.errores.push('El negocio ya existe en el sistema.')
                    return negocio
                })

                negociosSuccess = negocios.filter(negocio => !negocio.errores)
                negociosErrors = negocios.filter(negocio => negocio.errores)

                await TipoNegocioRepository.bulkCreate(negociosSuccess)

                if (negociosErrors.length > 0) {
                    return this.infoResponse(res, {
                        success: false,
                        message: 'Archivo con errores.',
                        data: {
                            negociosSuccess: negociosSuccess.length,
                            negociosErrors: negociosErrors,
                        }
                    })
                }

                return this.successResponse(res, {
                    success: true,
                    message: 'Importación correcta.',
                    data: negociosSuccess
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

export default TipoNegocioController
