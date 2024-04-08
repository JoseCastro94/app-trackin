import ArticuloNegocioRepository from "../repositories/ArticuloNegocioRepository.js";
import StockRepository from "../repositories/StockRepository.js";
import GrupoArticuloRepository from "../repositories/GrupoArticuloRepository.js";
import TipoNegocioRepository from "../repositories/TipoNegocioRepository.js";
import ParametroRepository from "../repositories/ParametroRepository.js";
import ArticuloRepository from "../repositories/ArticuloRepository.js";
import {sequelize} from "../database/database.js";
import BaseController from "./BaseController.js";
import Util from "../utils/Util.js";
import S3 from "../utils/AwsS3.js";
import {v4 as uuidv4} from "uuid";
import Sequelize, { Op } from "sequelize"

class ArticuloController extends BaseController {
    static listar = async (req, res) => {
        try {
            const {company} = req.headers
            const pagination = Util.pagination(req)
            // pagination.filter.push(['IdEmpresa', 'eq', company.id])
            const data = await ArticuloRepository.listar(pagination, company.id)
            const newData = {
                count: data.length,
                rows :data
            }
            return this.successResponse(res, newData)
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }
    
    /* static listarNegocios = async (req, res) => {
        try {
            const {company} = req.headers
            const pagination = Util.pagination(req)
            console.log("entro")
            console.log(pagination)
            return this.successResponse(res, {data:[]})
            const data = await ArticuloRepository.listar(pagination, company.id)
            const newData = {
                count: data.length,
                rows :data
            }
            return this.successResponse(res, newData)
        } catch (error) {
            return this.errorResponse(res, error)
        }
    } */

    static crear = async (req, res) => {
        try {
            const {user} = req.headers
            const now = new Date()
            const year = now.getFullYear()
            const month = now.getMonth() + 1
            const { body } = req
            let keyPhoto = ''
            let keyFile = ''
            let mimeFile = ''

            const existeArticulo = await ArticuloRepository.buscarPorCodigo(body.codigo)

            if (existeArticulo) {
                return this.infoResponse(res, {
                    success: false,
                    message: 'Ya existe el codigo.',
                    data: existeArticulo
                })
            }

            if (req.files) {
                const { photo = null, file = null } = req.files

                if (photo) {
                    const extPhoto = String(photo.name).split('.').pop()
                    keyPhoto = `articulos/photos/${year}/${month}/${uuidv4()}.${extPhoto}`
                    await S3.uploadFile(keyPhoto, photo.data)
                }

                if (file) {
                    const extFile = String(file.name).split('.').pop()
                    keyFile = `articulos/files/${year}/${month}/${uuidv4()}.${extFile}`
                    mimeFile = file.mimetype
                    await S3.uploadFile(keyFile, file.data)
                }
            }

            body.negocios = Array.isArray(body.negocios) ? body.negocios : [body.negocios]
            const GrupoArticulo = Array.isArray(body.GrupoArticulo) ? body.GrupoArticulo : [body.GrupoArticulo]
            
            let item = 0
            const arrayCreate = []
            for await (const idGrupoArticulo of GrupoArticulo) {
                const create = await ArticuloRepository.create({
                    ItemCode: body.codigo,
                    ItemName: body.name,
                    Codebars: body.code_bar,
                    IdUnidadMedida: body.unidad_medida,
                    FotoAttach: keyPhoto,
                    FichaTecnicaAttach: keyFile,
                    MimeFichaTecnica: mimeFile,
                    Procedencia: body.procedencia,
                    UsuarioCreacion: user.username,
                    IdGrupoArticulo: idGrupoArticulo,
                    ArticuloNegocios: {
                        Nombre: '',
                        Descripcion: '',
                        UsuarioCreacion: user.username,
                        IdNegocio: body.negocios[item]
                    }
                })
                item++;
                arrayCreate.push(create)
            }
            /* const create = await ArticuloRepository.create({
                ItemCode: body.codigo,
                ItemName: body.name,
                Codebars: body.code_bar,
                IdUnidadMedida: body.unidad_medida,
                FotoAttach: keyPhoto,
                FichaTecnicaAttach: keyFile,
                MimeFichaTecnica: mimeFile,
                Procedencia: body.procedencia,
                UsuarioCreacion: user.username,
                IdGrupoArticulo: idGrupoArticulo,
                ArticuloNegocios: body.negocios.map(item => {
                    return {
                        Nombre: '',
                        Descripcion: '',
                        UsuarioCreacion: user.username,
                        IdNegocio: item
                    }
                })
            }) */

            
            return this.createdResponse(res, {
                success: true,
                message: 'Registro exitoso',
                data: arrayCreate
            })
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }

    static update = async (req, res) => {
        const {user} = req.headers
        let transaction = await sequelize.transaction({
            autocommit: false,
            isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED
        })

        try {
            const now = new Date()
            const year = now.getFullYear()
            const month = now.getMonth() + 1
            const { body } = req
            let keyPhoto = ''
            let keyFile = ''

            console.log(body)
            let ArticuloInicial = body.idArticuloInicial
            delete body.idArticuloInicial
            delete body.ArticuloNegocios
            let NegocioInicial = body.idNegocioInicial
            delete body.idNegocioInicial
            let GrupoArticuloInicial = body.idGrupoArticuloInicial
            delete body.idGrupoArticuloInicial
            let IdGrupoArticulo = body.GrupoArticulo
            delete body.GrupoArticulo
            let IdTipoNegocios = body.negocios
            delete body.negocios 

            if (!Array.isArray(IdTipoNegocios)) {
                IdTipoNegocios = [String(IdTipoNegocios)]
                IdGrupoArticulo = [String(IdGrupoArticulo)]
            }

            if (!Array.isArray(ArticuloInicial)) {
                ArticuloInicial = [String(ArticuloInicial)]
                NegocioInicial = [String(NegocioInicial)]
                GrupoArticuloInicial = [String(GrupoArticuloInicial)]
            } 


            if (req.files) {
                const {photo, file} = req.files
                if (photo) {
                    const extPhoto = String(photo.name).split('.').pop()
                    keyPhoto = `articulos/photos/${year}/${month}/${uuidv4()}.${extPhoto}`
                    await S3.uploadFile(keyPhoto, photo.data)
                }

                if (file) {
                    const extFile = String(file.name).split('.').pop()
                    keyFile = `articulos/files/${year}/${month}/${uuidv4()}.${extFile}`
                    await S3.uploadFile(keyFile, file.data)
                }
            }


            
            const NewGrupoArticulo = []
            const NewNegocio = []
            const DeleteGrupoArticulo = []
            const DeleteNegocio = []
            const DeleteArticulo = []
            let cont = 0;
            for await (const id of IdGrupoArticulo) {
                const nuevo = GrupoArticuloInicial.filter(idGrupoArticulo => String(idGrupoArticulo) === String(id)).length > 0
                if(!nuevo){
                    NewGrupoArticulo.push(id)
                    NewNegocio.push(IdTipoNegocios[cont])                    
                }
                cont++
            }

            let cont1 = 0;
            for await (const idGrupoArt of GrupoArticuloInicial) {
                const eliminar = IdGrupoArticulo.filter(id => String(id) === String(idGrupoArt)).length > 0
                if(!eliminar){
                    DeleteGrupoArticulo.push(idGrupoArt)
                    DeleteNegocio.push(NegocioInicial[cont1])
                    DeleteArticulo.push(ArticuloInicial[cont1])
                }
                cont1++
            }

            let it = 0
            const arrayCreate = []
            for await (const IdGruArt of NewGrupoArticulo) {
                const create = await ArticuloRepository.create({
                    ItemCode: body.codigo,
                    ItemName: body.name,
                    Codebars: body.code_bar,
                    IdUnidadMedida: body.unidad_medida,
                    FotoAttach: keyPhoto || body.foto,
                    FichaTecnicaAttach: keyFile  || body.file,
                    Procedencia: body.procedencia,
                    UsuarioCreacion: user.username,
                    IdGrupoArticulo: IdGruArt,
                    ArticuloNegocios: {
                        Nombre: '',
                        Descripcion: '',
                        UsuarioCreacion: user.username,
                        IdNegocio: NewNegocio[it]
                    }
                })
                it++;
                arrayCreate.push(create)
            }

            const arrayUpdate = []
            for await (const id of IdGrupoArticulo) {
                const create = await ArticuloRepository.update({
                    ItemName: body.name,
                    Codebars: body.code_bar,
                    IdUnidadMedida: body.unidad_medida,
                    FotoAttach: keyPhoto || body.foto,
                    FichaTecnicaAttach: keyFile  || body.file,
                    Procedencia: body.procedencia,
                    UsuarioModifica: user.username,
                    FechaModifica: new Date(),
                }, {
                    ItemCode: body.codigo,
                    IdGrupoArticulo: id
                }, transaction)
                arrayUpdate.push(create)
            }


            //Eliminar 

            const ArticuloNoEliminado = []
            for await (const idArticulo of DeleteArticulo) {
                const dat = await StockRepository.buscarPorId(idArticulo)
                console.log(dat)
                /* const existe = dat.length > 0 */                    
                if(dat === null  ){
                    await ArticuloNegocioRepository.eliminarPorIdArticulo(idArticulo, transaction)
                    await ArticuloRepository.eliminarPorId(idArticulo, transaction)
                }else{
                    ArticuloNoEliminado.push(idArticulo)
                }
            }

            await transaction.commit()
            
            if(ArticuloNoEliminado.length > 0){
                return this.infoResponse(res, {
            message: `Se modifico, pero No se pudo eliminar los Id de Articulo 
                    \n '${ArticuloNoEliminado}, 
                    \n  porque Esta relacionada con la tabla Stock.`,
                })
            }

            return this.createdResponse(res, {
                success: true,
                message: 'Actualización exitosa',
                data: arrayUpdate
            })
        } catch (error) {
            await transaction.rollback()
            return this.errorResponse(res, error)
        }
    }

    static eliminar = async (req, res) => {
        const {user} = req.headers
        const ids = req.body
        if (!Array.isArray(ids)) {
            ids = [String(ids)]
        }

        try {
            const articulo = await ArticuloRepository.findById(ids[0])
            const response = await ArticuloRepository.update({
                Activo: !articulo.Activo,
                UsuarioModifica: user.username,
                FechaModifica: new Date(),
            }, { IdArticulo: { [Op.in] : ids} })
            return this.createdResponse(res, {
                success: true,
                message: `Registro ${articulo.Activo ? 'eliminado' : 'activado'}.`,
                data: response
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
            let articulos = []
            let articulosSuccess = []
            let articulosErrors = []
            if (req.files) {
                let codigoArticulos = []
                let negocios = []
                let grupos = []
                let unidadMedidas = []
                const procedencias = ['SAP', 'TRACKING']

                articulos = await Util.readExcel(req.files)

                articulos.filter(articulo => !articulo.Nombre).map(articulo => {
                    articulo.errores = articulo.errores ?? []
                    articulo.errores.push('Nombre es requerido.')
                    return articulo
                })

                articulos.filter(articulo => !articulo.UnidadMedida).map(articulo => {
                    articulo.errores = articulo.errores ?? []
                    articulo.errores.push('Unidad Medida es requerido.')
                    return articulo
                })

                articulos.filter(articulo => !articulo.Procedencia).map(articulo => {
                    articulo.errores = articulo.errores ?? []
                    articulo.errores.push('Procedencia es requerido.')
                    return articulo
                })

                articulos.filter(articulo => !articulo.Grupo).map(articulo => {
                    articulo.errores = articulo.errores ?? []
                    articulo.errores.push('Grupo es requerido.')
                    return articulo
                })

                articulos.filter(articulo => !articulo.Negocio).map(articulo => {
                    articulo.errores = articulo.errores ?? []
                    articulo.errores.push('Negocio es requerido.')
                    return articulo
                })

                articulos.forEach(articulo => {
                    if (!articulo.errores) {
                        codigoArticulos.push(articulo.Codigo)
                        negocios.push(articulo.Negocio)
                        grupos.push(articulo.Grupo)
                        unidadMedidas.push(articulo.UnidadMedida)
                    }
                })

                const [articulosExistentes, negociosExistentes, gruposExistentes, unidadMedidaExistentes] = await Promise.all([
                    ArticuloRepository.buscarPorCodigos(codigoArticulos, transaction),
                    TipoNegocioRepository.buscarPorNombres(negocios, company.id, transaction),
                    GrupoArticuloRepository.buscarPorNombres(grupos, company.id, transaction),
                    ParametroRepository.buscarPorNombres(unidadMedidas, '4f9d46a9-ae7f-4e8d-a9a6-e288ee881765', transaction)
                ])

                articulos = articulos.map(articulo => {
                    const obj = articulosExistentes.find(item => item.ItemCode === articulo.Codigo)
                    if (obj) {
                        articulo.errores = articulo.errores ?? []
                        articulo.errores.push(`El artículo con código ${obj.ItemCode} ya existe.`)
                        articulo.IdArticulo = obj.IdArticulo
                    }

                    const negocio = negociosExistentes.find(negocio => negocio.Nombre === articulo.Negocio)
                    if (!negocio) {
                        articulo.errores = articulo.errores ?? []
                        articulo.errores.push('Negocio no existe.')
                    }
                    articulo.IdNegocio = negocio?.IdNegocio

                    const grupo = gruposExistentes.find(grupo => grupo.Nombre === articulo.Grupo)
                    if (!grupo) {
                        articulo.errores = articulo.errores ?? []
                        articulo.errores.push('Grupo no existe.')
                    } else {
                        articulo.IdGrupoArticulo = grupo.IdGrupoArticulo
                    }

                    const unidadMedida = unidadMedidaExistentes.find(unidadMedida => unidadMedida.Nombre === articulo.UnidadMedida)
                    if (!unidadMedida) {
                        articulo.errores = articulo.errores ?? []
                        articulo.errores.push('Unidad medida no existe.')
                    } else {
                        articulo.IdUnidadMedida = unidadMedida.IdParametro
                    }

                    if (!procedencias.includes(articulo.Procedencia.toUpperCase())) {
                        articulo.errores = articulo.errores ?? []
                        articulo.errores.push('Procedencia no existe.')
                    }

                    articulo.ItemCode = articulo.Codigo
                    articulo.ItemName = articulo.Nombre
                    articulo.Codebars = ''
                    articulo.FotoAttach = ''
                    articulo.FichaTecnicaAttach = ''
                    articulo.UsuarioCreacion = user.username
                    articulo.ArticuloNegocios = []

                    return articulo
                })

                articulos = articulos.sort((a, b) => {
                    const lengthA = a.hasOwnProperty('errores') ? a.errores.length : 0;
                    const lengthB = b.hasOwnProperty('errores') ? b.errores.length : 0;
                    return lengthA > lengthB ? 1 : lengthA < lengthB ? -1 : 0
                })

                articulos = articulos.reduce((previousValue, currentValue) => {
                    if (previousValue.find(articulo => articulo.Codigo === currentValue.Codigo)) {
                        currentValue.errores = currentValue.errores ?? []
                        currentValue.errores.push('El código articulo se repite en el excel.')
                    }
                    previousValue.push(currentValue)
                    return previousValue
                }, [])

                articulosSuccess = articulos.filter(articulo => !articulo.errores)
                articulosErrors = articulos.filter(articulo => articulo.errores).sort((a, b) => {
                    return a.N > b.N ? 1 : a.N < b.N ? -1 : 0
                })

                let dataArticuloNegocios = []

                if (articulosSuccess.length > 0) {
                    dataArticuloNegocios = articulosSuccess.map(articulo => {
                        return {
                            Nombre: '',
                            Descripcion: '',
                            UsuarioCreacion: user.username,
                            IdNegocio: articulo.IdNegocio,
                            IdArticulo: articulo.ItemCode
                        }
                    })
                    await ArticuloRepository.bulkCreate(articulosSuccess, transaction)
                }

                const text = 'El código articulo se repite en el excel.'
                articulosErrors.filter(item => item.errores.includes(text)).map(articulo => {
                    dataArticuloNegocios.push({
                        Nombre: '',
                        Descripcion: '',
                        UsuarioCreacion: user.username,
                        IdNegocio: articulo.IdNegocio,
                        IdArticulo: articulo.ItemCode
                    })
                })

                if (dataArticuloNegocios.length > 0){
                    codigoArticulos = dataArticuloNegocios.map(articulo => articulo.IdArticulo)
                    codigoArticulos = [...new Set(codigoArticulos)]
                    let artExistentes = await ArticuloRepository.buscarPorCodigos(codigoArticulos, transaction)

                    dataArticuloNegocios = dataArticuloNegocios.map(data => {
                        const objArt = artExistentes.find(art => art.ItemCode === data.IdArticulo)
                        if (objArt) {
                            data.IdArticulo = objArt.IdArticulo
                        } else {
                            delete data.IdArticulo
                        }
                        return data
                    })

                    let idArticuloIdNegocio = dataArticuloNegocios
                        .filter(item => item.hasOwnProperty('IdArticulo') && item.IdNegocio)
                        .map(articulo => `${articulo.IdArticulo}|${articulo.IdNegocio}`)
                    idArticuloIdNegocio = [...new Set(idArticuloIdNegocio)]
                    let articulosNegociosExistentes = await ArticuloNegocioRepository.buscarPorIdArticuloAndIdNegocio(idArticuloIdNegocio, transaction)

                    dataArticuloNegocios = dataArticuloNegocios
                        .filter(item => item.hasOwnProperty('IdArticulo') && item.IdNegocio)
                        .filter(item => !articulosNegociosExistentes.find(artNeg => `${artNeg.IdArticulo}|${artNeg.IdNegocio}` === `${item.IdArticulo}|${item.IdNegocio}`))

                    dataArticuloNegocios = dataArticuloNegocios.reduce((previousValue, currentValue) => {
                        if (!previousValue.find(item => item.IdNegocio === currentValue.IdNegocio && item.IdArticulo === currentValue.IdArticulo)) {
                            previousValue.push(currentValue)
                        }
                        return previousValue
                    }, [])

                    if (dataArticuloNegocios.length > 0) {
                        await ArticuloNegocioRepository.bulkCreate(dataArticuloNegocios, transaction)
                    }
                }

                await transaction.commit()
                if (articulosErrors.length > 0) {
                    return this.infoResponse(res, {
                        success: false,
                        message: 'Archivo con errores.',
                        data: {
                            articulosSuccess: articulosSuccess.length,
                            articulosErrors: articulosErrors
                        }
                    })
                }
                return this.successResponse(res, {
                    success: true,
                    message: 'Importación correcta.',
                    data: {
                        articulosSuccess
                    }
                })
            }

            return this.successResponse(res, {
                success: false,
                message: 'No existe archivo.',
            })
        } catch (error) {
            await transaction.rollback()
            return this.errorResponse(res, error)
        }
    }

    static downloadFichaTecnica = async (req, res) => {
        const {id} = req.params
        try {
            const articulo = await ArticuloRepository.findById(id)
            S3.downloadFile(res, articulo.FichaTecnicaAttach, articulo.MimeFichaTecnica)
        } catch (error) {
            return this.errorResponse(res, error)
        }
    }
}

export default ArticuloController
