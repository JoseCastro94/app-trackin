import GrupoParametroRepository from "../repositories/GrupoParametroRepository.js";
import ParametroRepository from "../repositories/ParametroRepository.js";
import BaseController from "./BaseController.js";
import Util from "../utils/Util.js";

class ParametroController extends BaseController {
    static listar = async (req, res) => {
        try {
            const pagination = Util.pagination(req)
            const data = await ParametroRepository.listar(pagination)
            return this.successResponse(res, data)
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }

    static crear = async (req, res) => {
        try {
            const {user} = req.headers
            const data = {...req.body, UsuarioCreacion: user.username}
            const existe = await ParametroRepository.existe(data.Nombre, data.IdGrupo)
            if (existe) {
                return this.infoResponse(res, {
                    success: false,
                    message: 'Ya existe el parametro.',
                    data: existe
                })
            }

            const create = await ParametroRepository.create(data)
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
            const {id, Nombre, Descripcion, IdGrupo } = req.body
            const update = await ParametroRepository.update({
                Nombre,
                Descripcion,
                IdGrupo,
                UsuarioModifica: user.username,
                FechaModifica: new Date()
            }, {
                IdParametro: id
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
            const parametro = await ParametroRepository.buscarPorId(id)
            const destroy = await ParametroRepository.update({
                Activo: !parametro.Activo,
                UsuarioModifica: user.username,
                FechaModifica: new Date()
            }, {
                IdParametro: id
            })
            return this.createdResponse(res, {
                success: true,
                message: `Registro ${parametro.Activo ? 'eliminado' : 'activado'}.`,
                data: destroy
            })
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }

    static importData = async (req, res) => {
        const {user, company} = req.headers
        try {
            let parametros = []
            let parametrosSuccess = []
            let parametrosErrors = []
            if (req.files) {
                parametros = await Util.readExcel(req.files)
                parametros = parametros.reduce((previousValue, currentValue) => {
                    if (previousValue.find(parametro => parametro.Nombre === currentValue.Nombre)) {
                        currentValue.errores = currentValue.errores ?? []
                        currentValue.errores.push('El nombre de parametro se repite en el excel.')
                    }
                    previousValue.push(currentValue)
                    return previousValue
                }, [])

                parametros.filter(parametro => !parametro.Nombre).map(parametro => {
                    parametro.errores = parametro.errores ?? []
                    parametro.errores.push('Nombre es requerido.')
                    return parametro
                })

                parametros.filter(parametro => !parametro.Grupo).map(parametro => {
                    parametro.errores = parametro.errores ?? []
                    parametro.errores.push('Grupo es requerido.')
                    return parametro
                })

                const nombresGrupos = parametros.map(parametro => parametro.Grupo || '')
                const gruposExistentes = await GrupoParametroRepository.buscarPorNombres(nombresGrupos)
                parametros.map(parametro => {
                    const grupo = gruposExistentes.find(item => item.Nombre === parametro.Grupo)
                    if (!grupo) {
                        parametro.errores = parametro.errores ?? []
                        parametro.errores.push('El grupo parámetro no existe en el sistema.')
                    } else {
                        parametro.IdGrupo = grupo.IdGrupo
                        parametro.UsuarioCreacion = user.username
                    }
                    return parametro
                })

                const nombres = parametros.map(parametro => parametro.Nombre || '')
                const parametrosExistentes = await ParametroRepository.buscarPorNombres(nombres)
                parametros.filter(parametro => parametrosExistentes.find(item => item.Nombre === parametro.Nombre)).map(parametro => {
                    parametro.errores = parametro.errores ?? []
                    parametro.errores.push('El parámetro ya existe en el sistema.')
                    return parametro
                })

                parametrosSuccess = parametros.filter(parametro => !parametro.errores)
                parametrosErrors = parametros.filter(parametro => parametro.errores)

                await ParametroRepository.bulkCreate(parametrosSuccess)

                if (parametrosErrors.length > 0) {
                    return this.infoResponse(res, {
                        success: false,
                        message: 'Archivo con errores.',
                        data: {
                            parametrosSuccess: parametrosSuccess.length,
                            parametrosErrors: parametrosErrors,
                        }
                    })
                }

                return this.successResponse(res, {
                    success: true,
                    message: 'Importación correcta.',
                    data: parametrosSuccess
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

export default ParametroController
