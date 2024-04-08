import GrupoArticuloMaestroRepository from "../repositories/GrupoArticuloMaestroRepository.js";
import GrupoArticuloRepository from "../repositories/GrupoArticuloRepository.js";
import ArticuloRepository from "../repositories/ArticuloRepository.js";
import BaseController from "./BaseController.js";
import Util from "../utils/Util.js";
import {sequelize} from "../database/database.js";
import Sequelize from "sequelize";

class GrupoArticuloMaestroController extends BaseController {
    static listar = async (req, res) => {
        try {
            const {user ,company} = req.headers
            const data = await GrupoArticuloMaestroRepository.listar(user.id_user,company.id)
            return this.successResponse(res, data)
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }

    
    static listarPaginacion = async (req, res) => {
        try {
            const {company} = req.headers
            const pagination = Util.pagination(req)
            pagination.filter.push(['GrupoArticuloMaestros.IdEmpresa', 'eq', company.id])
            const data = await GrupoArticuloMaestroRepository.listWithPagination(pagination)
            return this.successResponse(res, data)
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }

    static crear = async (req, res) => {
        try {
            const {user, company} = req.headers
            const IdTipoNegocios = req.body.IdGrupos
            delete req.body.IdGrupos
            const data = {...req.body, UsuarioCreacion: user.username, IdEmpresa: company.id}
            const exist = await GrupoArticuloMaestroRepository.buscarPorNombre(data.Nombre)

            if (exist) {
                return this.infoResponse(res, {
                    success: false,
                    message: 'Ya existe el grupo artículo.',
                    data: exist
                })
            }
            
            const create = await GrupoArticuloMaestroRepository.create(data)
            if(create){
                for await (const idNegocio of IdTipoNegocios) {
                    const data1 = {...data, IdNegocio: idNegocio, IdGrupoArticuloMaestro: create.IdGrupoArticuloMaestro}
                    //console.log(data1)
                    GrupoArticuloRepository.create(data1)
                }
                
            }

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
            
            const IdTipoNegocios = req.body.IdGrupos
            delete req.body.IdGrupos
            const IdGrupoArticulos = req.body.GrupoArticulos
            delete req.body.GrupoArticulos

            const data = {...req.body, UsuarioModifica: user.username, FechaCreacion: new Date()}
            delete data.id
            delete data.Activo

            const exist = await GrupoArticuloMaestroRepository.buscarPorNombre(data.Nombre, id)

            if (exist) {
                return this.infoResponse(res, {
                    success: false,
                    message: 'Ya existe el grupo artículo.',
                    data: exist
                })
            }

            const updateMaestro = await GrupoArticuloMaestroRepository.update(data, {
                IdGrupoArticuloMaestro: id
            })
            const newData = {
                Nombre: data.Nombre,
                Descripcion: data.Descripcion,
            }
            const updateGrupoArticulo = await GrupoArticuloRepository.update(newData, {
                IdGrupoArticuloMaestro: id
            })
            const NewNegocios = []
            const DeleteNegocios = []
            
            if(updateMaestro){
                for await (const idNegocio of IdTipoNegocios) {
                    const nuevo = IdGrupoArticulos.filter(grupo => String(grupo.id) === String(idNegocio)).length > 0
                    
                    if(!nuevo){
                        NewNegocios.push(idNegocio)
                    }
                }

                for await (const grupo of IdGrupoArticulos) {
                    const eliminar = IdTipoNegocios.filter(idnegocio => String(idnegocio) === String(grupo.id)).length > 0
                    
                    if(!eliminar){
                        DeleteNegocios.push(grupo.id)
                    }
                }
                
                for await (const IdNeg of NewNegocios) {
                    const newdata = {...data, IdNegocio: IdNeg, IdGrupoArticuloMaestro: id}
                    GrupoArticuloRepository.create(newdata)
                }
                const NegocioNoEliminado = []
                for await (const IdNegDel of DeleteNegocios) {
                    const dat = await GrupoArticuloMaestroRepository.buscarExistenciaNegocio(IdNegDel,id)
                    const existe = dat.length > 0                    
                    if(!existe){
                        /* const updateDestroy = await GrupoArticuloRepository.update({
                            Activo: 0,
                            UsuarioModifica: user.username,
                            FechaModifica: new Date(),
                        }, {
                            IdGrupoArticuloMaestro: id,
                            IdNegocio: IdNegDel
                        }) */
                        const deleted = await GrupoArticuloRepository.destroy(IdNegDel,id)
                        //return this.deletedResponse(res, deleted)

                    }else{
                        NegocioNoEliminado.push(IdNegDel)
                    }
                }
                if(NegocioNoEliminado.length > 0){
                    return this.infoResponse(res, {
                        message: 'Se modifico, pero No se pudo eliminar los Id de Tipo de Negocio '+NegocioNoEliminado+', porque existen artículos que lo tienen configurado.',
                    })
                }

                
            }

            return this.createdResponse(res, {
                success: true,
                message: 'Actualización exitoso',
                data: {
                    update:updateMaestro,
                    añadidos:NewNegocios,
                    eliminado:DeleteNegocios,
                }
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

            const grupo = await GrupoArticuloMaestroRepository.buscarPorId(id)

            const destroy = GrupoArticuloMaestroRepository.update({
                Activo: !grupo.Activo,
                UsuarioModifica: user.username,
                FechaModifica: new Date(),
            }, {
                IdGrupoArticuloMaestro: id
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
            let grupoArticuloMaestro = []
            let grupoArticuloMaestroSuccess = []
            let grupoArticuloMaestroErrors = []
            if (req.files) {
                grupoArticuloMaestro = await Util.readExcel(req.files)
                const siNo = ['SI', 'NO']

                grupoArticuloMaestro = grupoArticuloMaestro.reduce((previousValue, currentValue) => {
                    if (previousValue.find(grupo => grupo.Nombre === currentValue.Nombre)) {
                        currentValue.errores = currentValue.errores ?? []
                        currentValue.errores.push('El nombre de grupo se repite en el excel.')
                    }
                    previousValue.push(currentValue)
                    return previousValue
                }, [])

                let nombreGrupos = grupoArticuloMaestro.map(grupo => grupo.Nombre || '')
                nombreGrupos = [...new Set(nombreGrupos)]
                const gruposExistentes = await GrupoArticuloMaestroRepository.buscarPorNombres(nombreGrupos, company.id)
                grupoArticuloMaestro.filter(grupo => gruposExistentes.find(item => item.Nombre === grupo.Nombre)).map(grupo => {
                    grupo.errores = grupo.errores ?? []
                    grupo.errores.push('El grupo ya existe en el sistema.')
                    return grupo
                })

                grupoArticuloMaestro.filter(grupo => !grupo.Nombre).map(grupo => {
                    grupo.errores = grupo.errores ?? []
                    grupo.errores.push('Nombre es requerido.')
                    return grupo
                })

                grupoArticuloMaestro.filter(grupo => !grupo.AplicaDevolucion).map(grupo => {
                    grupo.errores = grupo.errores ?? []
                    grupo.errores.push('AplicaDevolucion es requerido.')
                    return grupo
                })

                grupoArticuloMaestro.filter(grupo => grupo.DiasDevolucion !== 0 && !grupo.DiasDevolucion ).map(grupo => {
                    grupo.errores = grupo.errores ?? []
                    grupo.errores.push('DiasDevolucion es requerido.')
                    return grupo
                })

                grupoArticuloMaestro.filter(grupo => grupo.DiasDevolucion !== 0 && !parseInt(grupo.DiasDevolucion)).map(item => {
                    item.errores = item.errores ?? []
                    item.errores.push('DiasDevolucion debe ser un número.')
                    return item
                })

                grupoArticuloMaestro.filter(grupo => !grupo.AplicaEvaluacion).map(grupo => {
                    grupo.errores = grupo.errores ?? []
                    grupo.errores.push('AplicaEvaluacion es requerido.')
                    return grupo
                })

                grupoArticuloMaestro.filter(grupo => !grupo.TieneSerie).map(grupo => {
                    grupo.errores = grupo.errores ?? []
                    grupo.errores.push('TieneSerie es requerido.')
                    return grupo
                })

                grupoArticuloMaestro.filter(grupo => !siNo.includes(grupo.AplicaDevolucion)).map(grupo => {
                    grupo.errores = grupo.errores ?? []
                    grupo.errores.push('AplicaDevolucion Solo se acepta SI o NO.')
                    return grupo
                })

                grupoArticuloMaestro.filter(grupo => !siNo.includes(grupo.AplicaEvaluacion)).map(grupo => {
                    grupo.errores = grupo.errores ?? []
                    grupo.errores.push('AplicaEvaluacion Solo se acepta SI o NO.')
                    return grupo
                })

                grupoArticuloMaestro.filter(grupo => !siNo.includes(grupo.TieneSerie)).map(grupo => {
                    grupo.errores = grupo.errores ?? []
                    grupo.errores.push('TieneSerie Solo se acepta SI o NO.')
                    return grupo
                })

                /*
                const empresas = grupoArticuloMaestro.map(grupo => grupo.Empresa || '')
                const empresasExistentes = await EmpresaRepository.buscarPorNombres(empresas)
                grupoArticuloMaestro.map(grupo => {
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

                grupoArticuloMaestroSuccess = grupoArticuloMaestro.filter(grupo => !grupo.errores)
                grupoArticuloMaestroErrors = grupoArticuloMaestro.filter(grupo => grupo.errores)

                grupoArticuloMaestroSuccess = grupoArticuloMaestroSuccess.map(grupo => {
                    grupo.U_DiasEntrega = grupo.DiasDevolucion
                    grupo.U_Devolucion = grupo.AplicaDevolucion === 'SI' ? 'Y' : 'N'
                    grupo.U_Evaluacion = grupo.AplicaEvaluacion === 'SI' ? 'Y' : 'N'
                    grupo.TieneSerie = grupo.TieneSerie === 'SI'
                    grupo.IdEmpresa = company.id
                    grupo.UsuarioCreacion = user.username
                    return grupo
                })

                if (grupoArticuloMaestroSuccess.length > 0)
                    await GrupoArticuloMaestroRepository.bulkCreate(grupoArticuloMaestroSuccess, transaction)

                await transaction.commit()
                if (grupoArticuloMaestroErrors.length > 0) {
                    return this.infoResponse(res, {
                        success: false,
                        message: 'Archivo con errores.',
                        data: {
                            grupoArticuloMaestroSuccess: grupoArticuloMaestroSuccess.length,
                            grupoArticuloMaestroErrors: grupoArticuloMaestroErrors
                        }
                    })
                }


                return this.successResponse(res, {
                    success: true,
                    message: 'Importación correcta.',
                    data: {
                        grupoArticuloMaestroSuccess
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

export default GrupoArticuloMaestroController
