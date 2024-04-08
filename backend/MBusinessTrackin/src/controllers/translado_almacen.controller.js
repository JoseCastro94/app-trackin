import { TransladoAlmacen } from '../models/TransladoAlmacen.js'
import { DetalleTransladoAlmacen } from '../models/DetalleTransladoAlmacen.js'
import { Parametro } from '../models/Parametro.js'
import { Almacen } from '../models/Almacen.js'
import { ESTADO_TRANSFERENCIA_ALMACENES, TYPE_STOCK } from '../storage/const.js'
import Sequelize, { Op } from "sequelize"
import { TransferStock, TransladoControlSerie } from '../operations/stocks.js'
import { Usuario } from '../models/Usuario.js'
import { Articulo } from '../models/Articulo.js'
import TrasladoAlmacenRepository from "../repositories/TrasladoAlmacenRepository.js";
import { Ubigeo } from '../models/Ubigeo.js'
import fetch from "node-fetch";
import { UsuarioAlmacen } from '../models/UsuarioAlmacen.js'
import { Stock } from '../models/Stock.js'
import Util from '../utils/Util.js'
import { GrupoArticulo } from '../models/GrupoArticulo.js'
import { ArticuloNegocio } from '../models/ArticuloNegocio.js'
import { TipoNegocio } from '../models/TipoNegocio.js'
import { UsuarioNegocio } from '../models/UsuarioNegocio.js'
import { GrupoTrabajador } from '../models/GrupoTrabajador.js'
import { v4 as uuidv4 } from "uuid"
import { GrupoArticuloMaestro } from '../models/GrupoArticuloMaestro.js'

//const usuario_activo = "45631343"
//const id_usuario_activo = "36f440fa-7a19-4da7-999e-b5a95789df94"

export const ins = async (req, res) => {
    const { user, company } = req.headers
    const usuario_activo = user.username
    const id_usuario_activo = user.id_user
    const id_empresa_activo = company.id

    try {
        const {
            warehouse,
            warehouseTo,
            detalle
        } = req.body

        let resultado = {
            status: 'Ok',
            message: 'Se insertó la solicitud correctamente'
        }

        let msg = []

        const list_stock = await Stock.findAll({
            where: {
                IdAlmacen: warehouse.IdAlmacen,
                IdNegocio: detalle.map(e => e.IdNegocio),
                IdArticulo: detalle.map(e => e.IdArticulo),
                Tipo: 'DISPONIBLE'
            }
        })

        for (const row of detalle) {
            const find_stock = list_stock.find(f => f.IdAlmacen === warehouse.IdAlmacen && f.IdNegocio === row.IdNegocio && f.IdArticulo === row.IdArticulo)
            if (find_stock) {
                const find_previo = await DetalleTransladoAlmacen.findAll({
                    where: {
                        IdNegocio: row.IdNegocio,
                        IdArticulo: row.IdArticulo
                    },
                    include: {
                        attributes: [],
                        model: TransladoAlmacen,
                        where: {
                            IdAlmacenOrigen: warehouse.IdAlmacen,
                            IdEstado: ESTADO_TRANSFERENCIA_ALMACENES.EN_TRANSITO
                        },
                        required: true
                    }
                })

                let total_en_transito = 0
                find_previo.forEach(f => { total_en_transito += f.CantidadEnviada })

                const stock_disponible = find_stock.Cantidad - total_en_transito

                if (stock_disponible < row.Cantidad) {
                    msg.push(`El artículo ${row.ItemCode} excede la cantidad disponible, favor de revisar si existe un translado en proceso`)
                }
            }
        }

        if (msg.length === 0) {
            let now = new Date()
            let year = now.getFullYear()

            let last_corr = await TransladoAlmacen.max('Correlativo', {
                where: {
                    Periodo: year
                }
            })

            let corr = 1

            if (last_corr) {
                corr = last_corr + 1
            }

            const details = detalle.map(element => {
                let detail = {
                    ItemCode: element.ItemCode,
                    ItemName: element.ItemName,
                    Grupo: element.Grupo,
                    U_BPP_TIPUNMED: element.U_BPP_TIPUNMED,
                    CodeBars: element.Codebars,
                    CantidadEnviada: element.Cantidad,
                    UsuarioCreacion: usuario_activo,
                    UsuarioModifica: usuario_activo,
                    IdNegocio: element.IdNegocio,
                    IdArticulo: element.IdArticulo,
                    TipoStock: element.TipoStock,
                    SerialNumber: element.SerialNumber === 'N/A' ? undefined : element.SerialNumber
                }
                return detail
            })

            let newTransladoAlmacen = await TransladoAlmacen.create({
                IdUsuario: id_usuario_activo,
                UsuarioCreacion: usuario_activo,
                UsuarioModifica: usuario_activo,
                IdAlmacenOrigen: warehouse.IdAlmacen,
                IdAlmacenDestino: warehouseTo.IdAlmacen,
                Periodo: year,
                Correlativo: corr,
                IdEstado: ESTADO_TRANSFERENCIA_ALMACENES.EN_TRANSITO,
                IdEmpresa: id_empresa_activo,
                DetalleTransladoAlmacenes: details
            }, {
                include: [DetalleTransladoAlmacen]
            })

            const data = await TrasladoAlmacenRepository.findByPk(newTransladoAlmacen.IdTranslado)
            await fetch(process.env.API_MAILING, {
                method: 'POST',
                body: JSON.stringify({
                    'email': user.correo,
                    'subject': 'TRASLADO ALMACEN',
                    'template': 'traslado-almacen.template',
                    'data': data
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        } else {
            resultado.status = 'Error'
            resultado.message = msg.join(', ')
        }
        res.json(resultado)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

// FUNCION PARA LISTADO DE TRANSFERENCIAS ( HOME)
export const getList = async (req, res) => {
    const { company, user } = req.headers
    const id_empresa_activo = company.id
    const id_usuario_activo = user.id_user

    try {
        const {
            fecha_inicio,
            fecha_fin,
        } = req.body

        const find_access = await UsuarioAlmacen.findAll({
            where: {
                IdUsuario: id_usuario_activo
            }
        })

        const isAdmin = find_access.filter(f => f.IsAdmin === true)

        const list_almacen = find_access.map(element => element.IdAlmacen)

        const solicitudes = await TransladoAlmacen.findAll({
            attributes: [
                ["IdTranslado", "id"],
                "FechaTranslado",
                "FechaRecepcion",
                "Periodo",
                "Correlativo",
                "IdAlmacenOrigen",
                "IdAlmacenDestino",
                "IdEstado",
                "Observacion",
                [Sequelize.col('Parametro.Nombre'), "Estado"],
                [Sequelize.col('AlmacenOrigen.Nombre'), "OrigenAlmacen"],
                [Sequelize.col('AlmacenDestino.Nombre'), "DestinoAlmacen"],
            ],
            include: [{
                model: Parametro,
                attributes: []
            }, {
                model: Almacen,
                as: 'AlmacenOrigen',
                attributes: [],
                required: true
            }, {
                model: Almacen,
                as: 'AlmacenDestino',
                attributes: [],
                required: true
            }],
            where: {
                IdEmpresa: id_empresa_activo,
                [Op.or]: [
                    {
                        IdAlmacenOrigen: {
                            [Op.in]: list_almacen
                        }
                    },
                    {
                        IdAlmacenDestino: {
                            [Op.in]: list_almacen
                        }
                    },
                ],
                FechaCreacion: {
                    [Op.gte]: fecha_inicio
                },
                FechaCreacion: {
                    [Op.lte]: fecha_fin
                },
            },
            order: [
                ["FechaCreacion", "DESC"]
            ]
        })
        res.json({
            isAdmin,
            solicitudes
        })
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

// FUNCION PARA ACTUALIZAR INFORMACION DE TRANSFERENCIAS ( HOME)
export const upd = async (req, res) => {
    const { user } = req.headers
    const usuario_activo = user.username

    try {
        const {
            IdTranslado,
        } = req.params

        const {
            comentario,
            detalle
        } = req.body

        let resultado = {
            status: 'Ok',
            message: 'Se actualizó la solicitud correctamente'
        }

        let msg = []

        if (msg.length === 0) {
            const findTranslado = await TransladoAlmacen.findByPk(IdTranslado)
            findTranslado.Observacion = comentario
            findTranslado.UsuarioModifica = usuario_activo
            findTranslado.FechaModifica = new Date()
            findTranslado.IdEstado = ESTADO_TRANSFERENCIA_ALMACENES.FINALIZADO
            findTranslado.FechaTranslado = new Date()
            await findTranslado.save()

            for (const detail of detalle) {
                const findDetalle = await DetalleTransladoAlmacen.findByPk(detail.id)
                findDetalle.CantidadRecibida = detail.CantidadRecibida
                findDetalle.UsuarioModifica = usuario_activo
                findDetalle.FechaModifica = new Date()
                await findDetalle.save()
                await TransferStock(
                    findDetalle.TipoStock,
                    findTranslado.IdAlmacenOrigen,
                    findTranslado.IdAlmacenDestino,
                    findDetalle.IdNegocio,
                    findDetalle.IdArticulo,
                    detail.CantidadRecibida
                )
                if (findDetalle.SerialNumber !== '' && findDetalle.SerialNumber !== null && findDetalle.SerialNumber) {
                    await TransladoControlSerie(findDetalle.SerialNumber, findDetalle.IdArticulo, findTranslado.IdAlmacenDestino)
                }
            }
        }

        res.json(resultado)
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: e.message });
    }
}

export const getStats = async (req, res) => {
    const { company, user } = req.headers
    const id_empresa_activo = company.id
    const id_usuario_activo = user.id_user

    try {
        const {
            fecha_inicio,
            fecha_fin,
        } = req.body

        const find_access = await UsuarioAlmacen.findAll({
            where: {
                IdUsuario: id_usuario_activo
            }
        })

        const list_almacen = find_access.map(element => element.IdAlmacen)

        const stats = await TransladoAlmacen.findAll({
            attributes: [
                ["IdEstado", "Estado"],
                [Sequelize.fn("COUNT", Sequelize.col("IdEstado")), "Stat"],
            ],
            where: {
                IdEmpresa: id_empresa_activo,
                [Op.or]: [
                    {
                        IdAlmacenOrigen: {
                            [Op.in]: list_almacen
                        }
                    },
                    {
                        IdAlmacenDestino: {
                            [Op.in]: list_almacen
                        }
                    },
                ],
                FechaCreacion: {
                    [Op.gte]: fecha_inicio
                },
                FechaCreacion: {
                    [Op.lte]: fecha_fin
                },
            },
            group: 'IdEstado'
        })
        res.json(stats)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const getOne = async (req, res) => {
    const { company } = req.headers
    const id_empresa_activo = company.id

    try {
        const {
            IdTransferencia
        } = req.body

        const translado = await TransladoAlmacen.findOne({
            attributes: [
                "IdTranslado"
            ],
            include: [{
                model: Almacen,
                as: 'AlmacenOrigen',
                include: {
                    model: Ubigeo
                }
            }, {
                model: Almacen,
                as: 'AlmacenDestino',
                include: {
                    model: Ubigeo
                }
            }, {
                model: Usuario,
                attributes: [
                    "TipoDocumento",
                    "NroDocumento"
                ]
            }, {
                model: DetalleTransladoAlmacen,
                include: {
                    model: Articulo,
                    include: {
                        model: Parametro
                    }
                }
            }],
            where: {
                IdEmpresa: id_empresa_activo,
                IdTranslado: IdTransferencia
            },
        })
        res.json(translado)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

// CARGA MASIVA
export const loadFromFile = async (req, res) => {
    const { user, company } = req.headers
    const id_usuario_activo = user.id_user
    const id_empresa_activo = company.id

    
    try {
        let parametros = []
        parametros = await Util.readLoopExcel(req.files)

        const data = parametros[0]

        const result = []

        for (const row of data) {
            const msg = []

            if (!row.IdAlmacenOrigen) {
                row.IdAlmacenOrigen = ''
            }

            if (!row.IdAlmacenDestino) {
                row.IdAlmacenDestino = ''
            }

            if (!row.IdUsuario) {
                row.IdUsuario = ''
            }

            if (!row.itemCode) {
                row.itemCode = ''
            }

            if (!row.IdNegocio) {
                row.IdNegocio = ''
            }

            if (!row.IdArticulo) {
                row.IdArticulo = ''
            }

            if (!row.Cantidad) {
                row.Cantidad = 0
            }

            const find_almacenOrigen = await Almacen.findOne({
                where: {
                    IdAlmacen: row.IdAlmacenOrigen
                }
            })


            if (!find_almacenOrigen) {
                msg.push('No existe el almacen de origen')
            }

            const find_almacenDestino = await Almacen.findOne({
                where: {
                    IdAlmacen: row.IdAlmacenDestino
                }
            })

            if (!find_almacenDestino) {
                msg.push('No existe el almacen de destino')
            }

            const find_existe_articulo = await Articulo.findOne({
                where: {
                  ItemCode: row.itemCode,
                },
                include: {
                  model: GrupoArticulo,
                  where: {
                    IdNegocio: row.IdNegocio,
                  },
                },
              });


            if (!find_existe_articulo) {
                msg.push('No existe el articulo')
            } else {
                row.IdArticulo = find_existe_articulo.IdArticulo
            }


            const find_negocio = await TipoNegocio.findOne({
                where: {
                    IdNegocio: row.IdNegocio
                }
            })

            if(!find_negocio) {
                msg.push('El negocio no existe')
            }

            
                const almacenes = await Almacen.findAll({
                    attributes: [
                        "IdAlmacen",
                        "Nombre",
                        [Sequelize.literal("'--Dirección--'"), "Direccion"],
                        [Sequelize.col('UsuarioAlmacenes.Usuario.ApellidoPaterno'), "ApellidoPaterno"],
                        [Sequelize.col('UsuarioAlmacenes.Usuario.ApellidoMaterno'), "ApellidoMaterno"],
                        [Sequelize.col('UsuarioAlmacenes.Usuario.Nombres'), "Nombres"],
                        [Sequelize.col('UsuarioAlmacenes.Usuario.NroDocumento'), "NroDocumento"],
                    ],
                    where: {
                        IdEmpresa: id_empresa_activo,
                        Activo: true,
                    },
                        include: {
                            model: UsuarioAlmacen,
                            include: {
                                model: Usuario,
                                attributes: [],
                            },
                            attributes: [],
                            where: {
                                IdUsuario: id_usuario_activo
                            }
                        },
                    order: [['Descripcion', 'ASC']],
                })

                let isAlmacen = almacenes.filter((almacen) => almacen.IdAlmacen === row.IdAlmacenOrigen)
                
                if(isAlmacen.length == 0) {
                    msg.push('El almacen de origen no esta asociado al usuario')
                }
            

            

            
                const tipo_negocio_usuario = await TipoNegocio.findAll({
                    attributes: ['IdNegocio'],
                    include: {
                        model: Stock,
                        where: {
                         IdAlmacen: row.IdAlmacenOrigen
                        },
                    },
                    where: {
                        IdEmpresa: id_empresa_activo,
                      },
                      group: ['TipoNegocio.IdNegocio'],
                })

                let estaNegocio =  tipo_negocio_usuario.filter(negocio => negocio.IdNegocio === row.IdNegocio)
                if(estaNegocio.length === 0) {
                    msg.push('No se encontro un negocio asociado al almacen')
                }
            

        
            
                const find_article = await Articulo.findOne({
                    include: [{
                        model: Parametro,
                    }, {
                        model: GrupoArticulo
                    }, {
                        model: ArticuloNegocio,
                        where: {
                            IdNegocio: row.IdNegocio
                        }
                    }],
                    where: {
                        IdArticulo: row.IdArticulo
                    }
                })
    
                if (!find_article) {
                    msg.push('No se encontró el articulo')
                } else {
                    if (find_article.ArticuloNegocios.length === 0) {
                        msg.push('No se encontró el articulo negocio')
                    }
                    if (!find_article.Parametro) {
                        msg.push('No se encontró la unidad de medida')
                    }
                    if (!find_article.GrupoArticulo) {
                        msg.push('No se encontró el grupoarticulo')
                    }
                }


           const find_stock = await Stock.findOne({
                where: {
                    IdAlmacen: row.IdAlmacenOrigen,
                    IdNegocio: row.IdNegocio,
                    IdArticulo: row.IdArticulo,
                    Tipo: TYPE_STOCK.DISPONIBLE
                }
            })

            const Cantidad = parseInt(row.Cantidad)

                if (!find_stock) {
                    msg.push('No se encontró el stock')
                } else {
                    if (find_stock.Cantidad < Cantidad) {
                        msg.push('El número excede el stock disponible')
                    }
                }
            

            if (msg.length > 0) {
                result.push({
                    id: uuidv4(),
                    CodArticulo: row.itemCode,
                    Documento: '',
                    ItemCode: row.itemCode,
                    Articulo: '',
                    DNI: '',
                    Cantidad: row.Cantidad,
                    IdArticuloNegocio: '',
                    IdAlmacen: row.IdAlmacenOrigen,
                    IdAlmacenOrigen: row.IdAlmacenOrigen,
                    IdAlmacenDestino: row.IdAlmacenDestino,
                    AlmacenDestino: find_almacenDestino.Nombre,
                    AlmacenOrigen: find_almacenOrigen.Nombre,
                    IdNegocio: row.IdNegocio,
                    Negocio: find_negocio.Nombre,
                    Grupo: '',
                    U_BPP_TIPUNMED:'',
                    IdUsuarioNegocio: '',
                    CCosto: '',
                    CodigoCCosto: '',
                    IdArticulo: row.IdArticulo,
                    Nombre: '',
                    IdStock: find_stock?.IdStock,
                    __status: 'Error',
                    __message: msg.join(',')
                })
            } else {
                result.push({
                    id: uuidv4(),
                    CodArticulo: find_article.ItemCode,
                    ItemCode: row.itemCode,
                    ItemName: find_article.ItemName,
                    Cantidad: row.Cantidad,
                    IdAlmacen: row.IdAlmacenOrigen,
                    IdAlmacenOrigen: row.IdAlmacenOrigen,
                    AlmacenOrigen: find_almacenOrigen ? find_almacenOrigen.Nombre : '',
                    IdAlmacenDestino: row.IdAlmacenDestino,
                    AlmacenDestino: find_almacenDestino ? find_almacenDestino.Nombre : '',
                    IdNegocio: row.IdNegocio,
                    Negocio: find_negocio ? find_negocio.Nombre : '',
                    IdArticulo: row.IdArticulo,
                    CCosto: '',
                    CodigoCCosto: '',
                    IdControlSerie: '',
                    Grupo: find_article.GrupoArticulo.Nombre,
                    U_BPP_TIPUNMED: find_article.Parametro.Nombre,
                    Codebars: '',
                    TipoStock: '',
                    IdStock: find_stock.IdStock,
                    SerialNumber: "N/A",
                    __status: 'Ok',
                    __message: ''
                })
            }
        }

        res.json(result)
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: e.message });
    }
}