import MovimientoMercanciaRepository from "../repositories/MovimientoMercanciaRepository.js";
import ArticuloNegocioRepository from "../repositories/ArticuloNegocioRepository.js";
import UsuarioAlmacenRepository from "../repositories/UsuarioAlmacenRepository.js";
import GrupoArticuloRepository from "../repositories/GrupoArticuloRepository.js";
import ControlSerieRepository from "../repositories/ControlSerieRepository.js";
import ParametroRepository from "../repositories/ParametroRepository.js";
import StockRepository from "../repositories/StockRepository.js";
import {ProcesarStock} from "../operations/stocks.js";
import {sequelize} from "../database/database.js";
import BaseController from "./BaseController.js";
import Util from "../utils/Util.js";
import S3 from "../utils/AwsS3.js";
import Sequelize from "sequelize";
import {v4 as uuidv4} from "uuid";
import fetch from "node-fetch";

class MovimientoMercanciaController extends BaseController {
    static index = async (req, res) => {
        try {
            const {user, company} = req.headers
            const { fecha_ini, fecha_fin } = req.query
            const almacenes = await UsuarioAlmacenRepository.listarPorId(user.id_user)
            const IdAlmacenes = almacenes.map(almacen => almacen.id)
            let data = await MovimientoMercanciaRepository.list(fecha_ini, fecha_fin, company.id, IdAlmacenes)
            data = await Promise.all(data.map(async item => {
                const almacenId = item.Almacene.id
                data.DetalleMovimientoMercancia = await Promise.all(item.DetalleMovimientoMercancia.map(async detalle => {
                    const stock = await StockRepository.buscar(almacenId, detalle.TipoNegocio.id, detalle.Articulo.id)
                    detalle.stock = stock.cantidad || 0
                    return detalle
                }))
                return item
            }))
            this.successResponse(res, data)
        } catch (error) {
            this.errorResponse(res, error)
        }
    }

    static create = async (req, res) => {
        const {body} = req
        const {user, company} = req.headers

        let transaction = await sequelize.transaction({
            autocommit: false,
            isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED
        })
        try {
            const stockArrayPromises = []
            const estadoDisponible = 'f80a2e96-3b92-4a20-a3d2-fc2db9d137fb'
            let controlSeries = body.articulos.filter(item => item.has_serie).map(item => {
                return {
                    SerialNumber: item.serie,
                    IdEstado: estadoDisponible,
                    UsuarioCreacion: user.username,
                    UsuarioModifica: user.username,
                    IdAlmacen: item.almacen.id,
                    IdNegocio: item.cuenta.id,
                    IdArticulo: item.id,
                    IdGrupoArticulo: item.id_grupo_articulo,
                    IdEmpresa: company.id
                }
            })

            const series = controlSeries.map(articulo => `${articulo.SerialNumber}|${articulo.IdArticulo}`)
            const seriesNoDisponibles = await ControlSerieRepository.findSeriesExistentes(series)

            if (seriesNoDisponibles.length > 0) {
                const series = seriesNoDisponibles.map(item => item.serie)
                return this.infoResponse(res, {
                    message: `Las series no estan disponibles: ${series.toString()}`
                })
            }

            body.articulos.filter(item => item.has_serie).reduce((acum, item) => {
                const index = acum.findIndex(el => el.codigo === item.codigo && el.almacen.id === item.almacen.id && el.cuenta.id === item.cuenta.id)
                if (index !== -1) {
                    acum[index].cantidad += item.cantidad
                    return acum;
                } else {
                    return acum.concat(item);
                }
            }, []).forEach(item => {
                stockArrayPromises.push(ProcesarStock({
                    IdTipoTransac: 'ING',
                    Cantidad: item.cantidad,
                    Tipo: 'INGRESO',
                    UsuarioCreacion: user.username,
                    IdUsuario: user.id_user,
                    IdEmpresa: company.id,
                    IdAlmacenOrigen: item.almacen.id,
                    IdDetalleSolicitud: null,
                    IdNegocio: item.cuenta.id,
                    IdArticulo: item.id,
                    ItemCode: item.codigo,
                    ItemName: item.descripcion,
                    Devolucion: item.devolucion,
                    Grupo: item.categoria,
                    transaction
                }))
            })

            const detalle = body.articulos.map(item => {
                if (!item.has_serie) {
                    stockArrayPromises.push(ProcesarStock({
                        IdTipoTransac: 'ING',
                        Cantidad: item.cantidad,
                        Tipo: 'INGRESO',
                        UsuarioCreacion: user.username,
                        IdUsuario: user.id_user,
                        IdEmpresa: company.id,
                        IdAlmacenOrigen: item.almacen.id,
                        IdDetalleSolicitud: null,
                        IdNegocio: item.cuenta.id,
                        IdArticulo: item.id,
                        ItemCode: item.codigo,
                        ItemName: item.descripcion,
                        Devolucion: item.devolucion,
                        Grupo: item.categoria,
                        transaction
                    }))
                }

                return {
                    ItemName: item.descripcion,
                    Cantidad: item.has_serie ? 1 : item.cantidad,
                    UsuarioCreacion: user.username,
                    Observacion: item.comentario,
                    Categoria: item.categoria,
                    Almacen: item.almacen.nombre,
                    IdArticulo: item.id,
                    IdNegocio: item.cuenta.id,
                    Nombre_GrupArt: item.categoria,
                    U_Devolucion: item.devolucion,
                    Codebars: item.codigo_barras,
                    U_BPP_TIPUNMED: item.unidad_medida,
                    IdUnidadMedida: item.id_unidad_medida,
                    SerialNumber: item.serie,
                }
            })

            const codigo = await MovimientoMercanciaRepository.getCodigo()
            const cabecera = {
                Codigo: codigo,
                DocReference: body.num_doc,
                Ruc: body.ruc,
                RazonSocial: body.razonSocial,
                Attach1: body.attach,
                Correos: body.email.toString(),
                UsuarioCreacion: user.username,
                IdAlmacen: body.almacen.id,
                IdEmpresa: company.id,
                IdTipo: body.tipo.id,
                IdTipoDoc: body.documento.id,
                DetalleMovimientoMercancia: detalle,
                ControlSeries: controlSeries
            }

            await Promise.all(stockArrayPromises)
            const register = await MovimientoMercanciaRepository.create(cabecera, transaction)

            if (body.email.length > 0) {
                body.articulos = body.articulos.map(articulo => {
                    articulo.cantidad = articulo.has_serie ? 1 : articulo.cantidad
                    return articulo
                })
                await fetch(process.env.API_MAILING, {
                    method: 'POST',
                    body: JSON.stringify({
                        'email': body.email,
                        'subject': 'INGRESO MERCADERÍA',
                        'template': 'ingreso-mercancia.template',
                        'data': body
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            }
            await transaction.commit()
            return this.successResponse(res, {
                success: true,
                message: 'Registro exitoso',
                data: register
            })
        } catch (error) {
            await transaction.rollback()
            return this.errorResponse(res, error)
        }
    }

    static uploadFile = async (req, res) => {
        try {
            let now = new Date()
            let year = now.getFullYear()
            let month = now.getMonth() + 1
            let {attached} = req.files

            let ext = String(attached.name).split('.').pop()
            const body = attached.data
            const key = `ingreso-mercaderia/${year}/${month}/${uuidv4()}.${ext}`
            await S3.uploadFile(key, body)
            return this.successResponse(res, { key })
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
            let cabecera = []
            let cabeceraSuccess = []
            let cabeceraErrors = []
            let detalle = []
            let detalleSuccess = []
            let detalleErrors = []
            if (req.files) {
                const stocksArray = []
                /*
                const {attached} = req.files
                const filePath = path.join(process.cwd(), 'src', 'public', 'import-files', attached.name)
                await Promise.all([attached.mv(filePath)])
                const workbook = XLSX.readFile(filePath)
                const sheetNames = workbook.SheetNames;
                cabecera = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]])
                detalle = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[1]])
                unlinkSync(filePath)
                */
                const data = await Util.readLoopExcel(req.files)
                console.log('DATA READ FILE', data)
                cabecera = data[0];
                detalle = data[1];

                console.log('cabecera', cabecera)
                console.log('detalle', detalle)

                const almacenes = await UsuarioAlmacenRepository.listarPorId(user.id_user)
                cabecera.filter(item => !almacenes.find(almacen => almacen.nombre === item.Almacen)).map(item => {
                    item.errores = item.errores ?? []
                    item.errores.push('Almacen no corresponde al usuario.')
                    return item
                })

                const tipoIngresos = await ParametroRepository.buscarPorIdGrupo('71021b89-3a78-483a-8dc4-a2d93e2b846c')
                    .then(item => item.map(tipo => tipo.toJSON()))
                cabecera.filter(item => !tipoIngresos.find(tipo => tipo.estado === item.TipoIngreso)).map(item => {
                    item.errores = item.errores ?? []
                    item.errores.push('Tipo ingreso no existe.')
                    return item
                })

                const tipoDocumentos = await ParametroRepository.buscarPorIdGrupo('c3d69b41-4ca8-45bd-a9ca-5587f28b500d')
                    .then(item => item.map(tipo => tipo.toJSON()))
                cabecera.filter(item => !tipoDocumentos.find(tipo => tipo.estado === item.TipoDocumento)).map(item => {
                    item.errores = item.errores ?? []
                    item.errores.push('Tipo documento no existe.')
                    return item
                })

                const documentoObligatorio = 'Compra Interna|Orden de Compra';
                cabecera.filter(item => `${item.TipoIngreso}|${item.TipoDocumento}` === documentoObligatorio && !item.NumeroDocumento).map(item => {
                    item.errores = item.errores ?? []
                    item.errores.push('Numero de documento obligatorio.')
                    return item
                })

                cabecera.filter(item => !item.Ruc).map(item => {
                    item.errores = item.errores ?? []
                    item.errores.push('Ruc obligatorio.')
                    return item
                })

                cabecera.filter(item => parseInt(item.Ruc).toString().length < 11).map(item => {
                    item.errores = item.errores ?? []
                    item.errores.push('Ruc debe ser válido.')
                    return item
                })

                cabecera.filter(item => !item.RazonSocial).map(item => {
                    item.errores = item.errores ?? []
                    item.errores.push('Razón Social obligatorio.')
                    return item
                })
                cabeceraSuccess = cabecera.filter(item => !item.errores)
                cabeceraErrors = cabecera.filter(item => item.errores)

                console.log('cabeceraSuccess', cabeceraSuccess)
                console.log('cabeceraErrors', cabeceraErrors)
                console.log('cabecera', cabecera)
                const ncabeceras = cabeceraSuccess.map(item => item.N)
                console.log('ncabeceras', ncabeceras)

                //DETALLE
                detalle = detalle.filter(item => ncabeceras.includes(item.Cabecera))
                detalle.filter(item => !Number.isInteger(item.Cantidad) && item.Cantidad <= 0).map(item => {
                    item.errores = item.errores ?? []
                    item.errores.push('La cantidad debe ser un número y mayor a 0.')
                    return item
                })

                const textSearchByArticuloAndNegocio = detalle.map(item => `${item.Articulo}|${item.Negocio}`)
                const articulosNegocios = await ArticuloNegocioRepository.buscarPorCodigoArticuloAndNombreNegocio(textSearchByArticuloAndNegocio || [], company.id)
                detalle.filter(item => !articulosNegocios.find(artNego => `${artNego.ItemCode}|${artNego.Negocio}` === `${item.Articulo}|${item.Negocio}`)).map(item => {
                    item.errores = item.errores ?? []
                    item.errores.push('El artículo no pertenece al negocio ó el negocio no existe.')
                    return item
                })


                let categorias = detalle.map(item => item.Categoria)
                categorias = [...new Set(categorias)]
                console.log('Categorias', categorias)
                const grupoArticulos = await GrupoArticuloRepository.buscarPorNombres(categorias, company.id)
                console.log('grupoArticulos', grupoArticulos)
                detalle.filter(item => !grupoArticulos.find(grupo => grupo.Nombre === item.Categoria)).map(item => {
                    item.errores = item.errores ?? []
                    item.errores.push('La categoría no existe.')
                    return item
                })

                const grupoArticulosConSerie = grupoArticulos.filter(grupo => grupo.TieneSerie).map(grupo => grupo.Nombre)
                console.log('grupoArticulosConSerie', grupoArticulosConSerie)
                detalle.filter(item => grupoArticulosConSerie.includes(item.Categoria) && !item.Serie).map(item => {
                    item.errores = item.errores ?? []
                    item.errores.push('La Serie es obligatoria.')
                    return item
                })

                detalle = detalle.reduce((previousValue, currentValue) => {
                    if (currentValue.Serie && previousValue.find(item => item.Serie === currentValue.Serie)) {
                        currentValue.errores = currentValue.errores ?? []
                        currentValue.errores.push('La serie se repite en el excel.')
                    }
                    previousValue.push(currentValue)
                    return previousValue
                }, [])

                const series = detalle.filter(articulo => articulo.Serie).map(articulo => `${articulo.Serie}|${articulo.Articulo}`)
                const seriesNoDisponibles = await ControlSerieRepository.findSeriesExistentesBySerieAndItemCode(series)
                detalle.filter(articulo => articulo.Serie && seriesNoDisponibles.find(item => item.serie === articulo.Serie && item.codigo === articulo.Articulo)).map(item => {
                    item.errores = item.errores ?? []
                    item.errores.push('La serie ya exíste para este artículo.')
                    return item
                })

                detalleSuccess = detalle.filter(item => !item.errores)
                detalleErrors = detalle.filter(item => item.errores)

                console.log('detalle', detalle)
                console.log('detalleSuccess', detalleSuccess)
                console.log('detalleErrors', detalleErrors)

                let dataRegister = []
                let codigo = await MovimientoMercanciaRepository.getCodigo(transaction)
                for (let i = 0; i < cabeceraSuccess.length; i++) {
                    const newCode = codigo.split('-')
                    newCode[2] = String(Number(newCode[2]) + i).padStart(6, '0')
                    let controlSeries = []
                    let almacen = almacenes.find(almacen => almacen.nombre === cabecera[i].Almacen)
                    let tipoIngreso = tipoIngresos.find(tipo => tipo.estado === cabecera[i].TipoIngreso)
                    let tipoDocumento = tipoDocumentos.find(tipo => tipo.estado === cabecera[i].TipoDocumento)
                    let detalle = detalleSuccess.filter(item => !item.errores && item.Cabecera === cabecera[i].N).map(item => {
                        let articuloNegocio = articulosNegocios.find(artNeg => `${artNeg.ItemCode}|${artNeg.Negocio}` === `${item.Articulo}|${item.Negocio}`)
                        let grupoArticulo = grupoArticulos.find(grupo => grupo.Nombre === item.Categoria)
                        let cantidad = grupoArticulo.TieneSerie ? 1 : item.Cantidad
                        const stock = {
                            IdTipoTransac: 'ING',
                            Cantidad: cantidad,
                            Tipo: 'INGRESO',
                            UsuarioCreacion: user.username,
                            IdUsuario: user.id_user,
                            IdEmpresa: company.id,
                            IdAlmacenOrigen: almacen.id,
                            IdDetalleSolicitud: null,
                            IdNegocio: articuloNegocio.IdNegocio,
                            IdArticulo: articuloNegocio.IdArticulo,
                            ItemCode: articuloNegocio.ItemCode,
                            ItemName: articuloNegocio.ItemName,
                            Devolucion: grupoArticulo.U_Devolucion,
                            Grupo: grupoArticulo.Nombre
                        }

                        if (grupoArticulo.TieneSerie) {
                            controlSeries.push({
                                SerialNumber: item.Serie,
                                IdEstado: 'f80a2e96-3b92-4a20-a3d2-fc2db9d137fb',
                                UsuarioCreacion: user.username,
                                UsuarioModifica: user.username,
                                IdAlmacen: almacen.id,
                                IdNegocio: articuloNegocio.IdNegocio,
                                IdArticulo: articuloNegocio.IdArticulo,
                                IdGrupoArticulo: grupoArticulo.IdGrupoArticulo,
                                IdEmpresa: company.id
                            })

                            const index = stocksArray.findIndex(el => el.IdArticulo === articuloNegocio.IdArticulo &&
                                el.IdAlmacenOrigen === almacen.id &&
                                el.IdNegocio === articuloNegocio.IdNegocio)

                            index !== -1 ? stocksArray[index].Cantidad += 1 : stocksArray.push(stock)
                        } else {
                            stocksArray.push(stock)
                        }

                        return {
                            ItemName: articuloNegocio.ItemName,
                            Cantidad: cantidad,
                            UsuarioCreacion: user.username,
                            Observacion: item.Comentario || '',
                            Categoria: item.Categoria,
                            Almacen: item.Almacen,
                            IdArticulo: articuloNegocio.IdArticulo,
                            IdNegocio: articuloNegocio.IdNegocio,
                            Nombre_GrupArt: grupoArticulo.Nombre,
                            U_Devolucion: grupoArticulo.U_Devolucion,
                            Codebars: articuloNegocio.Codebars,
                            U_BPP_TIPUNMED: articuloNegocio.U_BPP_TIPUNMED,
                            SerialNumber: grupoArticulo.TieneSerie ? item.Serie : '',
                        }
                    })

                    dataRegister.push({
                        Codigo: newCode.join('-'),
                        DocReference: cabecera[i].NumeroDocumento || '',
                        Attach1: cabecera[i].LinkDocumento || '',
                        Correos: cabecera[i].Correo || '',
                        UsuarioCreacion: user.username,
                        IdAlmacen: almacen.id,
                        IdEmpresa: company.id,
                        IdTipo: tipoIngreso.id,
                        IdTipoDoc: tipoDocumento.id,
                        DetalleMovimientoMercancia: detalle,
                        ControlSeries: controlSeries
                    })
                }
                // TODO: solo se registran las cabeceras que tienen detalle.
                dataRegister = dataRegister.filter(data => data.DetalleMovimientoMercancia.length > 0)

                console.log('dataRegister', JSON.stringify(dataRegister))
                const stockArrayPromises = stocksArray.map(item => ProcesarStock({...item, transaction}))
                await Promise.all(stockArrayPromises)
                await MovimientoMercanciaRepository.bulkCreate(dataRegister, transaction)

                await transaction.commit()

                if (cabeceraErrors.length > 0 || detalleErrors.length > 0) {
                    return this.infoResponse(res, {
                        success: false,
                        message: 'Archivo con errores.',
                        data: {
                            cabeceraSuccess: cabeceraSuccess.length,
                            cabeceraErrors: cabeceraErrors,
                            detalleSuccess: detalleSuccess.length,
                            detalleErrors: detalleErrors
                        }
                    })
                }

                return this.successResponse(res, {
                    success: true,
                    message: 'Importación correcta.',
                    data: cabecera
                })
            }

            return this.infoResponse(res, {
                success: false,
                message: 'No existe el archivo.'
            })
        } catch (error) {
            if (transaction.finished !== 'commit')
                await transaction.rollback()
            return this.errorResponse(res, error)
        }
    }
}

export default MovimientoMercanciaController
