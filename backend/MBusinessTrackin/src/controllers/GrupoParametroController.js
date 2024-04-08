import GrupoParametroRepository from "../repositories/GrupoParametroRepository.js";
import BaseController from "./BaseController.js";
import Util from "../utils/Util.js";

class GrupoParametroController extends BaseController {
    static listarParametros = async (req, res) => {
        const {id} = req.params
        try {
            const data = await GrupoParametroRepository.getParametros(id)
            return this.successResponse(res, data)
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }

    static listar = async (req, res) => {
        try {
            const pagination = Util.pagination(req)
            const data = await GrupoParametroRepository.listar(pagination)
            return this.successResponse(res, data)
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }

    static crear = async (req, res) => {
        try {
            const {user} = req.headers
            const data = {...req.body, UsuarioCreacion: user.username}
            const existe = await GrupoParametroRepository.buscarPorNombre(data.Nombre)
            if (existe) {
                return this.infoResponse(res, {
                    success: false,
                    message: 'Ya existe el grupo.',
                    data: existe
                })
            }

            const create = await GrupoParametroRepository.create(data)
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
            const {id} = req.body
            const update = await GrupoParametroRepository.update({
                Nombre: req.body.Nombre,
                Descripcion: req.body.Descripcion,
                UsuarioModifica: user.username,
                FechaModifica: new Date()
            }, {
                IdGrupo: id
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
            const parametros = await GrupoParametroRepository.getParametros(id)
            if (parametros.length) {
                return this.infoResponse(res, {
                    message: 'El grupo tiene parametros asignados.',
                })
            }

            const grupo = await GrupoParametroRepository.buscarPorId(id)

            const destroy = await GrupoParametroRepository.update({
                Activo: !grupo.Activo,
                UsuarioModifica: user.username,
                FechaModifica: new Date()
            }, {
                IdGrupo: id
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
        try {
            let grupoParametros = []
            let grupoParametrosSuccess = []
            let grupoParametrosErrors = []
            if (req.files) {
                grupoParametros = await Util.readExcel(req.files)
                grupoParametros = grupoParametros.reduce((previousValue, currentValue) => {
                    if (previousValue.find(grupo => grupo.Nombre === currentValue.Nombre)) {
                        currentValue.errores = currentValue.errores ?? []
                        currentValue.errores.push('El nombre de grupo se repite en el excel.')
                    }
                    previousValue.push(currentValue)
                    return previousValue
                }, [])

                grupoParametros.filter(grupo => !grupo.Nombre).map(grupo => {
                    grupo.errores = grupo.errores ?? []
                    grupo.errores.push('Nombre es requerido.')
                    return grupo
                })

                const nombresGrupos = grupoParametros.map(grupo => grupo.Nombre || '')
                const gruposExistentes = await GrupoParametroRepository.buscarPorNombres(nombresGrupos)
                grupoParametros.filter(grupo => gruposExistentes.find(item => item.Nombre === grupo.Nombre)).map(grupo => {
                    grupo.errores = grupo.errores ?? []
                    grupo.errores.push('El grupo ya existe en el sistema.')
                    return grupo
                })

                grupoParametrosSuccess = grupoParametros.filter(grupo => !grupo.errores).map(grupo => {
                    grupo.UsuarioCreacion = user.username
                    return grupo
                })
                grupoParametrosErrors = grupoParametros.filter(grupo => grupo.errores)

                await GrupoParametroRepository.bulkCreate(grupoParametrosSuccess)

                if (grupoParametrosErrors.length > 0) {
                    return this.infoResponse(res, {
                        success: false,
                        message: 'Archivo con errores.',
                        data: {
                            grupoParametrosSuccess: grupoParametrosSuccess.length,
                            grupoParametrosErrors: grupoParametrosErrors,
                        }
                    })
                }

                return this.successResponse(res, {
                    success: true,
                    message: 'Importación correcta.',
                    data: grupoParametrosSuccess
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

export default GrupoParametroController
