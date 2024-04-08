import Util from '../utils/Util.js'
import { SolicitudArticulo } from '../models/SolicitudArticulo.js'
import { SolicitudTransferencia } from '../models/SolicitudTransferencia.js'
import { DetalleSolicitudArticulo } from '../models/DetalleSolicitudArticulo.js'
import { DetalleSolicitudTransferencia } from '../models/DetalleSolicitudTransferencia.js'
import { GrupoParametro } from '../models/GrupoParametro.js'
import { Parametro } from '../models/Parametro.js'
import { ArticuloNegocio } from '../models/ArticuloNegocio.js'
import { Estado } from '../models/Estado.js'
import { DetalleDespachoSolicitud } from '../models/DetalleDespachoSolicitud.js'
import { ProcesarStock } from '../operations/stocks.js'
import { ProcesarDetalle } from '../operations/articulosTrans.js'
import Sequelize, { Op } from "sequelize"
import { sum } from '../operations/helper.js'
import { Stock } from '../models/Stock.js'
import { Articulo } from '../models/Articulo.js'
import { GrupoArticulo } from '../models/GrupoArticulo.js'
import { Usuario } from '../models/Usuario.js'
import { EmpresaParametro } from '../models/EmpresaParametro.js'
import { Almacen } from '../models/Almacen.js'
import { TipoNegocio } from '../models/TipoNegocio.js'
import CustomMail from "../utils/CustomMail.js"
import { v4 as uuidv4 } from "uuid"
import {
    TYPE_STOCK
} from '../storage/const.js'
import { UsuarioNegocio } from '../models/UsuarioNegocio.js'
import { GrupoTrabajador } from '../models/GrupoTrabajador.js'

//const usuario_activo = "45631343"
//const id_usuario_activo = "36f440fa-7a19-4da7-999e-b5a95789df94"
//const id_empresa_activo = "38d7f59f-5790-4853-afdc-f8bbc0c2eca0"
import SolicitudArticuloRepository from "../repositories/SolicitudArticuloRepository.js";
import SolicitudTransferenciaRepository from '../repositories/SolicitudTransferenciaRepository.js'
import fetch from "node-fetch";
import { make_book } from '../helper/Excel.js'
import { UsuarioAlmacen } from '../models/UsuarioAlmacen.js'

export const getSolicitudArticulos = async (req, res) => {
    try {
        const solicitud = await SolicitudArticulo.findAll({
            attributes: ["IdSocilitud", "Tipo", "FechaSolicitud", "FechaEntrega", "FechaPropuesta", "MotivoSolicitud"],
        })
        res.json(solicitud)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

// CREAR SOLICITUDES

export const createSolicitudArticulo = async (req, res) => {
    const { user, company } = req.headers
    const usuario_activo = user.username
    const id_usuario_activo = user.id_user
    const id_empresa_activo = company.id

    try {
        const {
            tipo,
            detalle,
            fecha_propuesta,
            motivo
        } = req.body

        let resultado = {
            status: 'Ok',
            message: 'Se insertó la solicitud correctamente'
        }

        const group_suma = sum(detalle, 'IdStock', 'Cantidad')

        const findStock = await Stock.findAll({
            where: {
                IdStock: {
                    [Op.in]: group_suma.map(e => e['IdStock'])
                },
            }
        })

        let msg = []

        findStock.map(element => {
            let find = group_suma.find(f => f.IdStock === element.IdStock)
            if (find) {
                if (find.Cantidad > element.Cantidad) {
                    msg.push('La cantidad ingresada supera al stock disponible')
                }
            }
        })

        if (msg.length === 0) {
            let now = new Date()
            let year = now.getFullYear()

            let last_corr = await SolicitudArticulo.max('Correlativo', {
                where: {
                    Tipo: 'PEDIDO',
                    Periodo: year
                }
            })

            let corr = 1

            if (last_corr) {
                corr = last_corr + 1
            }

            const generateDetail = detalle.map(element => {
                element.IdAlmacen = element.CodAlmacen
                return ProcesarDetalle(element)
            })

            const detalle_generado = []
            for (const proc_detalle of generateDetail) {
                detalle_generado.push(await proc_detalle.then())
            }

            //const detalle_generado = await Promise.all(generateDetail)
            let detalle_unido = []
            detalle_generado.forEach(element => {
                detalle_unido = detalle_unido.concat(element)
            })

            let detail = []
            detalle_unido.forEach(element => {
                detail.push({
                    IdDetalleSocilitud: element.id,
                    ItemCode: element.CodArticulo,
                    ItemName: element.Articulo,
                    Cantidad: element.Cantidad,
                    PendienteDevolver: element.Cantidad,
                    IdEstado: element.IdEstado,
                    UsuarioCreacion: usuario_activo,
                    UsuarioModifica: usuario_activo,
                    IdArticuloNegocio: element.IdArticuloNegocio,
                    IdEmpresa: id_empresa_activo,
                    IdUsuarioNegocio: element.IdUsuarioNegocio,
                    IdUsuario: element.IdUsuario,
                    IdNegocio: element.IdNegocio,
                    CCosto: element.CCosto,
                    CodigoCCosto: element.CodigoCCosto,
                    IdAlmacen: element.CodAlmacen,
                    U_BPP_TIPUNMED: element.U_BPP_TIPUNMED,
                    U_BPP_DEVOL: element.U_Devolucion,
                    U_MSSL_GRPART: element.U_Evaluacion,
                })
            })

            // ESTADO PENDIENTE PROGRAMAR

            const estado_pendiente_head = '1ba55dc8-3d0a-4c09-933e-7b5aabc70d60'

            let newSolicitudArticulo = await SolicitudArticulo.create({
                Tipo: tipo,
                IdUsuarioSolicita: id_usuario_activo,
                FechaPropuesta: fecha_propuesta,
                UsuarioCreacion: usuario_activo,
                UsuarioModifica: usuario_activo,
                IdEmpresa: id_empresa_activo,
                MotivoSolicitud: motivo,
                DetalleSolicitudArticulos: detail,
                IdEstado: estado_pendiente_head,
                Periodo: year,
                Correlativo: corr
            }, {
                include: [DetalleSolicitudArticulo]
            })

            for (const element of detalle_unido) {
                if (element.IdEstado === '95cf2544-a507-4ff1-b7b1-174a1e158dd0') {
                    await ProcesarStock({
                        IdTipoTransac: 'SOL',
                        Cantidad: - element.Cantidad,
                        Tipo: 'COMPROMETIDO',
                        UsuarioCreacion: usuario_activo,
                        IdUsuario: id_usuario_activo,
                        IdEmpresa: id_empresa_activo,
                        IdAlmacenOrigen: element.CodAlmacen,
                        IdDetalleSolicitud: element.id,
                        IdNegocio: element.IdNegocio,
                        IdArticulo: element.IdArticulo,
                        ItemCode: element.CodArticulo,
                        ItemName: element.Articulo,
                        Devolucion: element.U_Devolucion,
                        Grupo: element.Grupo,
                        TransferStock: 'COMPROMETIDO'
                    })
                }
            }

            // for (const task of tasks) {
            //     await task.then()
            // }
            //await Promise.all(tasks)

            const data = await SolicitudArticuloRepository.findById(newSolicitudArticulo.IdSocilitud);
            await fetch(process.env.API_MAILING, {
                method: 'POST',
                body: JSON.stringify({
                    'email': user.correo,
                    'subject': 'SOLICITUD',
                    'template': 'solicitud.template',
                    'data': data
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        } else {
            resultado.status = 'error'
            resultado.message = msg.join(', ')
        }
        res.json(resultado)
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: e.message });
    }
}

export const createSolicitudTransferencia = async (req, res) => {
    const { user, company } = req.headers
    const usuario_activo = user.username
    const id_usuario_activo = user.id_user
    const id_empresa_activo = company.id
    // console.log(id_empresa_activo)
    try {
        const {
            tipo,
            detalle,
            fecha_propuesta,
            motivo,
            usuario,
            DniSolicitante
        } = req.body

        const usuarioArr = usuario.split(' ')
        const responsableQuery = {
            ApellidoPaterno: usuarioArr[0],
            ApellidoMaterno: usuarioArr[1],
            Nombres: usuarioArr.slice(2).join(' ')
        }
 
        const responsableData = await Usuario.findOne({
            where: responsableQuery
        })
       
        const usuarioSolicitante = await Usuario.findOne({
            where: {
                NroDocumento: DniSolicitante
            }
        });        
 
        const idusuarioSolicitante = usuarioSolicitante.IdUsuario
        // const responsableCorreo = 'anibalmd32@gmail.com' ?? responsableData.dataValues.Correo
        const responsableCorreo = 'ricardooalba22@gmail.com' ?? responsableData.dataValues.Correo
 
        let resultado = {
            status: 'Ok',
            message: 'Se insertó la solicitud correctamente'
        }
 
       
 
        const group_suma = sum(detalle, 'IdStock', 'Cantidad')
 
        const findStock = await Stock.findAll({
            where: {
                IdStock: {
                    [Op.in]: group_suma.map(e => e['IdStock'])
                },
            }
        })
 
        let msg = []
 
        findStock.map(element => {
            let find = group_suma.find(f => f.IdStock === element.IdStock)
            if (find) {
                if (find.Cantidad > element.Cantidad) {
                    msg.push('La cantidad ingresada supera al stock disponible')
                }
            }
        })
 
        if (msg.length === 0) {
            let now = new Date()
            let year = now.getFullYear()
 
            let last_corr = await SolicitudTransferencia.max('Correlativo', {
                where: {
                    Tipo: 'PEDIDO',
                    Periodo: year
                }
            })
 
            let corr = 1
 
            if (last_corr) {
                corr = last_corr + 1
            }
 
            const generateDetail = detalle.map(element => {
                element.IdAlmacen = element.CodAlmacen
                return ProcesarDetalle(element)
            })
 
            const detalle_generado = []
            for (const proc_detalle of generateDetail) {
                detalle_generado.push(await proc_detalle.then())
            }
 
            //const detalle_generado = await Promise.all(generateDetail)
            let detalle_unido = []
            detalle_generado.forEach(element => {
                detalle_unido = detalle_unido.concat(element)
            })      
               
                const detail = detalle_unido.map(element => ({
                    IdDetalleSolicitud: element.id,
                    ItemCode: element.CodArticulo,
                    ItemName: element.Articulo,
                    Cantidad: element.Cantidad,
                    PendienteDevolver: element.Cantidad,
                    IdEstado: element.IdEstado,
                    UsuarioCreacion: usuario_activo,
                    UsuarioModifica: usuario_activo,
                    IdArticuloNegocio: element.IdArticuloNegocio,
                    IdEmpresa: id_empresa_activo,
                    IdUsuario: element.IdUsuario,
                    IdNegocio: element.IdNegocio,
                    CCosto: element.CCosto,
                    CodigoCCosto: element.CodigoCCosto,
                    IdAlmacen: element.CodAlmacen,
                    U_BPP_TIPUNMED: element.U_BPP_TIPUNMED,
                    U_BPP_DEVOL: element.U_Devolucion,
                    U_MSSL_GRPART: element.U_Evaluacion,
                    AlmacenDestino: element.AlmacenDestino,
                    AlmacenOrigen: element.AlmacenOrigen,
                    IdUsuarioDestino: element.IdUsuarioDestino
                }))

               
 
 
            // ESTADO PENDIENTE APROBACION
 
            const estado_pendiente_head = '4dabb637-f9f3-43d9-bfc8-f95f17450e17'
            // return res.json({
            //     Tipo: tipo,
            //     FechaPropuesta: fecha_propuesta,
            //     FechaSolicitud: new Date(),
            //     UsuarioCreacion: usuario_activo,
            //     UsuarioModifica: usuario_activo,
            //     IdEmpresa: id_empresa_activo,
            //     MotivoSolicitud: motivo,
            //     DetalleSolicitudTransferencia: detail,
            //     IdEstado: estado_pendiente_head,
            //     Periodo: year,
            //     Correlativo: corr,
            //     IdUsuarioDestino: '72f80060-52af-4722-82d1-2c8fdbb0398b',
            //     IdAlmacenDestino: detail[0].AlmacenDestino,
            //     IdAlmacenOrigen: detail[0].AlmacenOrigen
            // })
 
                /*
                    UsuarioCreacion: head.UsuarioCreacion,
                    IdSolicitud: head.IdSolicitud,
                    IdParametro: head.IdEstado,
                    Tipo: head.Tipo,
                */
       
            await SolicitudTransferencia.create({
                Tipo: tipo,
                FechaPropuesta: fecha_propuesta,
                FechaSolicitud: new Date(),
                UsuarioCreacion: usuario_activo,
                UsuarioModifica: usuario_activo,
                IdEmpresa: id_empresa_activo,
                MotivoSolicitud: motivo,
                DetalleSolicitudTransferencia: detail,
                IdEstado: estado_pendiente_head,
                Periodo: year,
                Correlativo: corr,
                IdUsuarioDestino: idusuarioSolicitante,
                IdAlmacenDestino: detail[0].AlmacenDestino,
                IdAlmacenOrigen: detail[0].AlmacenOrigen,
                IdUsuarioNegocioDestino:usuarioSolicitante,
                IdArticuloNegocio: detail.IdArticuloNegocio
            }, {
                include: [DetalleSolicitudTransferencia]
            })
 
            // for (const element of detalle_unido) {
            //     if (element.IdEstado === '4dabb637-f9f3-43d9-bfc8-f95f17450e17') {
            //         await ProcesarStock({
            //             IdTipoTransac: 'SOLTRAN',
            //             Cantidad: - element.Cantidad,
            //             Tipo: 'COMPROMETIDO',
            //             UsuarioCreacion: usuario_activo,
            //             IdUsuario: id_usuario_activo,
            //             IdEmpresa: id_empresa_activo,
            //             IdAlmacenOrigen: element.CodAlmacen,
            //             IdAlmacenDestino: element.CodAlmacen,
            //             IdDetalleSolicitud: element.id,
            //             IdNegocio: element.IdNegocio,
            //             IdArticulo: element.IdArticulo,
            //             ItemCode: element.CodArticulo,
            //             ItemName: element.Articulo,
            //             Devolucion: element.U_Devolucion,
            //             Grupo: element.Grupo,
            //             TransferStock: 'COMPROMETIDO'
            //         })
            //     }    
            // }
                    // PARA ENVIAR MENSAJE CON EL DETALLA
            // const data = await SolicitudTransferenciaRepository.findById(newSolicitudTransferencia.IdSolicitud);
            // await fetch(process.env.API_MAILING, {
            //     method: 'POST',
            //     body: JSON.stringify({
            //         'email': responsableCorreo,
            //         'subject': 'SOLICITUD DE TRANSFERENCIA',
            //         'template': 'solicitud-transferencia.template',
            //         'data': data
            //     }),
            //     headers: {
            //         'Content-Type': 'application/json'
            //     }
            // })
        } else {
            resultado.status = 'error'
            resultado.message = msg.join(', ')
        }
        res.json(resultado)
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: e.message });
    }
 
}



////////////////////////////////////////////////////////////////
export const getSolicitudesArticulosInfo = async (req, res) => {
    const { user, company } = req.headers;
    const id_usuario_activo = user.id_user;
    const id_empresa_activo = company.id;
 
    try {
        // Consulta de solicitudes de artículo
        const solicitudesArticulo = SolicitudArticulo.findAll({
            attributes: [
                ["IdSocilitud", "id"],
                "Tipo",
                [Sequelize.col('Parametro.Nombre'), "Estado"],
                [Sequelize.col('Parametro.IdParametro'), "IdParametro"],
                "FechaSolicitud",
                "FechaPropuesta",
                "MotivoSolicitud",
                "Periodo",
                "Correlativo",
            ],
            include: {
                model: Parametro,
                attributes: []
            },
            where: {
                IdUsuarioSolicita: id_usuario_activo,
                IdEmpresa: id_empresa_activo,
                IdEstado: {
                    [Op.notIn]: [
                        '4d43c52b-7858-4156-a537-d41d092c3399',
                        '217aeef5-2957-4a87-bfa8-8a6e65ed0737',
                    ]
                },
                Tipo: 'PEDIDO'
            },
            order: [
                ["FechaCreacion", "DESC"]
            ]
        });
 
        // Consulta de solicitudes de transferencia
        const solicitudesTransferencia = SolicitudTransferencia.findAll({
            attributes: [
                ["IdSolicitud", "id"],
                "Tipo",
                [Sequelize.col('Parametro.Nombre'), "Estado"],
                [Sequelize.col('Parametro.IdParametro'), "IdParametro"],
                "FechaSolicitud",
                "FechaPropuesta",
                "MotivoSolicitud",
                "Periodo",
                "Correlativo",
            ],
            include: {
                model: Parametro,
                attributes: []
            },
            where: {
                // IdUsuarioDestino: idusuarioSolicitante,
                IdEmpresa: id_empresa_activo,
                IdEstado: {
                    [Op.notIn]: [
                        '4d43c52b-7858-4156-a537-d41d092c3399',
                        '217aeef5-2957-4a87-bfa8-8a6e65ed0737',
                    ]
                },
                Tipo: 'PEDIDO'
            },
            order: [
                ["FechaCreacion", "DESC"]
            ]
        });
 
       
        const [solicitudesArticuloResult, solicitudesTransferenciaResult] = await Promise.all([
            solicitudesArticulo,
            solicitudesTransferencia
        ]);
 
       
        const solicitudes = {
            solicitudesArticulo: solicitudesArticuloResult,
            solicitudesTransferencia: solicitudesTransferenciaResult
        };
 
        res.json(solicitudes);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
};

export const getSolicitudArticulosInfo = async (req, res) => {
    const { company } = req.headers
    const id_empresa_activo = company.id

    try {
        const {
            IdSocilitud
        } = req.params

        const solicitud = await SolicitudArticulo.findOne({
            attributes: [
                ["IdSocilitud", "id"],
                "Tipo",
                [Sequelize.col('Parametro.Nombre'), "Estado"],
                [Sequelize.col('Parametro.IdParametro'), "IdParametro"],
                "FechaSolicitud",
                "FechaPropuesta",
                "MotivoSolicitud",
                "Periodo",
                "Correlativo",
            ],
            include: {
                model: Parametro,
                attributes: []
            },
            where: {
                IdSocilitud: IdSocilitud,
                IdEmpresa: id_empresa_activo
            }
        })
        res.json(solicitud)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const updSolicitudArticulo = async (req, res) => {
    const { user, company } = req.headers
    const usuario_activo = user.username
    const id_usuario_activo = user.id_user
    const id_empresa_activo = company.id

    try {
        const {
            IdSocilitud
        } = req.params

        const estado_pendiente_head = '217aeef5-2957-4a87-bfa8-8a6e65ed0737'

        const status = await SolicitudArticulo.upsert({
            IdSocilitud: IdSocilitud,
            IdEstado: estado_pendiente_head,
            UsuarioModifica: usuario_activo,
            FechaModifica: new Date(),
        })

        const detail_status = await DetalleSolicitudArticulo.update({
            UsuarioModifica: usuario_activo,
            FechaModifica: new Date(),
        }, {
            where: {
                IdSocilitud: IdSocilitud,
            }
        })

        const details = await DetalleSolicitudArticulo.findAll({
            where: {
                IdSocilitud: IdSocilitud,
            },
            attributes: [
                "Cantidad",
                "IdAlmacen",
                "IdDetalleSocilitud",
                "IdNegocio",
                [Sequelize.col('ArticuloNegocio.IdArticulo'), "IdArticulo"],
                [Sequelize.col('ArticuloNegocio.Articulo.ItemCode'), "ItemCode"],
                [Sequelize.col('ArticuloNegocio.Articulo.ItemName'), "ItemName"],
                [Sequelize.col('ArticuloNegocio.Articulo.GrupoArticulo.Nombre'), "Grupo"],
                [Sequelize.col('ArticuloNegocio.Articulo.GrupoArticulo.U_Devolucion'), "Devolucion"],
            ],
            include: {
                model: ArticuloNegocio,
                attributes: [],
                include: {
                    model: Articulo,
                    attributes: [],
                    include: {
                        model: GrupoArticulo,
                        attributes: []
                    }
                }
            }
        })
        for (const element of details) {
            let detail = element.toJSON()
            await ProcesarStock({
                IdTipoTransac: 'DEL',
                Cantidad: detail.Cantidad,
                Tipo: 'DESCOMPROMETIDO',
                UsuarioCreacion: usuario_activo,
                IdUsuario: id_usuario_activo,
                IdEmpresa: id_empresa_activo,
                IdAlmacenOrigen: detail.IdAlmacen,
                IdDetalleSolicitud: detail.IdDetalleSocilitud,
                IdNegocio: detail.IdNegocio,
                IdArticulo: detail.IdArticulo,
                ItemCode: detail.ItemCode,
                ItemName: detail.ItemName,
                Devolucion: detail.Devolucion,
                Grupo: detail.Grupo,
                TransferStock: 'COMPROMETIDO'
            })
        }
        //await Promise.all(tasks)
        res.json(status)
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: e.message });
    }
}

export const getConteoUsuario = (IdGrupo) => {
    return async (req, res) => {
        const { user, company } = req.headers
        const id_usuario_activo = user.id_user
        const id_empresa_activo = company.id

        try {
            const getStatus = await GrupoParametro.findOne({
                where: {
                    IdGrupo: IdGrupo
                },
                include: {
                    model: Parametro,
                    where: {
                        Activo: true
                    }
                }
            })

            let estados = getStatus.Parametros.map(x => x)

            let action = estados.map(x => {
                return new Promise((resolve, reject) => {
                    SolicitudArticulo.count({
                        where: {
                            IdEmpresa: id_empresa_activo,
                            IdUsuarioSolicita: id_usuario_activo,
                            IdEstado: x.IdParametro
                        }
                    }).then(count => {
                        resolve({
                            count,
                            IdParametro: x.IdParametro,
                            Nombre: x.Nombre
                        })
                    })
                })
            })

            Promise.all(action).then(r => {
                res.json(r)
            })
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }
}

export const getSolicitudesArticulosActivo = (tipo, po_notin) => {
    return async (req, res) => {
        const { user, company } = req.headers
        const id_usuario_activo = user.id_user
        const id_empresa_activo = company.id

        try {
            const solicitudes = await SolicitudArticulo.findAll({
                attributes: [
                    ["IdSocilitud", "id"],
                    "Tipo",
                    [Sequelize.col('Parametro.Nombre'), "Estado"],
                    "FechaSolicitud",
                    "FechaPropuesta",
                    "MotivoSolicitud",
                    "Periodo",
                    "Correlativo",
                    "IdEstado",
                ],
                include: {
                    model: Parametro,
                    attributes: []
                },
                where: {
                    IdUsuarioSolicita: id_usuario_activo,
                    IdEmpresa: id_empresa_activo,
                    Tipo: tipo,
                    IdEstado: {
                        [Op.notIn]: po_notin
                    }
                },
                order: [
                    ["FechaCreacion", "DESC"]
                ]
            })
            res.json(solicitudes)
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }
}

export const getSolicitudesArticulosHistorico = (tipo, op_in) => {
    return async (req, res) => {
        const { user, company } = req.headers
        const id_usuario_activo = user.id_user
        const id_empresa_activo = company.id

        try {
            const solicitudes = await SolicitudArticulo.findAll({
                attributes: [
                    ["IdSocilitud", "id"],
                    "Tipo",
                    [Sequelize.col('Parametro.Nombre'), "Estado"],
                    "FechaSolicitud",
                    "FechaPropuesta",
                    "MotivoSolicitud",
                    "Periodo",
                    "Correlativo",
                    "IdEstado",
                ],
                include: {
                    model: Parametro,
                    attributes: []
                },
                where: {
                    IdUsuarioSolicita: id_usuario_activo,
                    IdEmpresa: id_empresa_activo,
                    Tipo: tipo,
                    IdEstado: {
                        [Op.in]: op_in
                    }
                },
                order: [
                    ["FechaCreacion", "DESC"]
                ]
            })
            res.json(solicitudes)
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }
}

export const getTrackSolicitud = ({
    para_pendiente = '',
    para_proceso = '',
    para_entregado = '',
    para_cancelado = '',
}) => {
    return async (req, res) => {
        try {
            const {
                IdSocilitud
            } = req.params

            const get_info = async (para) => {
                return await Parametro.findOne({
                    where: {
                        IdParametro: para
                    },
                    include: {
                        model: Estado,
                        attributes: [
                            "FechaCreacion"
                        ],
                        where: {
                            IdSocilitud: IdSocilitud
                        },
                        required: false
                    }
                })
            }

            const pendiente = await get_info(para_pendiente)
            const proceso = await get_info(para_proceso)
            const entregado = await get_info(para_entregado)
            const cancelado = await get_info(para_cancelado)

            res.json({
                pendiente,
                proceso,
                entregado,
                cancelado
            })
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }
}

export const insDevolucion = async (req, res) => {
    const { user, company } = req.headers
    const usuario_activo = user.username
    const id_usuario_activo = user.id_user
    const id_empresa_activo = company.id

    try {
        const {
            motivo,
            detalle
        } = req.body

        let now = new Date()
        let year = now.getFullYear()

        let last_corr = await SolicitudArticulo.max('Correlativo', {
            where: {
                Tipo: 'DEVOLUCION',
                Periodo: year
            }
        })

        let corr = 1

        if (last_corr) {
            corr = last_corr + 1
        }

        const estado_pendiente_head = 'ff7535f6-3274-4ab8-9972-5a45109048db'
        const estado_pendiente = '95cf2544-a507-4ff1-b7b1-174a1e158dd0'

        let detail = detalle.map(element => {
            element.ItemCode = element.CodArticulo
            element.ItemName = element.Articulo
            element.Cantidad = element.CantidadDevuelto
            element.IdEstado = estado_pendiente
            element.UsuarioCreacion = usuario_activo
            element.UsuarioModifica = usuario_activo
            element.IdArticuloNegocio = element.IdArticuloNegocio
            element.IdEmpresa = id_empresa_activo
            element.IdUsuarioNegocio = element.IdUsuarioNegocio
            element.IdUsuario = element.IdUsuario
            element.IdNegocio = element.IdNegocio
            element.CCosto = element.CCosto
            element.CodigoCCosto = element.CodigoCCosto
            element.IdAlmacen = element.IdAlmacen
            element.U_BPP_TIPUNMED = element.U_BPP_TIPUNMED
            element.U_BPP_DEVOL = element.U_BPP_DEVOL
            element.U_MSSL_GRPART = element.U_MSSL_GRPART
            element.SerialNumber = element.SerialNumber === "S/A" ? null : element.SerialNumber
            return element
        })

        let fecha_propuesta = new Date()
        fecha_propuesta.setDate(fecha_propuesta.getDate() + 1)

        const newSolicitudArticulo = await SolicitudArticulo.create({
            Tipo: 'DEVOLUCION',
            Periodo: year,
            Correlativo: corr,
            IdEstado: estado_pendiente_head,
            MotivoSolicitud: motivo,
            UsuarioCreacion: usuario_activo,
            UsuarioModifica: usuario_activo,
            IdUsuarioSolicita: id_usuario_activo,
            IdEmpresa: id_empresa_activo,
            DetalleSolicitudArticulos: detail,
            FechaPropuesta: fecha_propuesta
        }, {
            include: [DetalleSolicitudArticulo]
        })

        const update_data_preview = (id, number) => {
            const exec_update = async () => {
                await DetalleDespachoSolicitud.decrement({
                    PendienteDevolver: number
                }, {
                    where: {
                        IdDetalleDespacho: id,
                    }
                })
                return true
            }
            return new Promise((resolve, reject) => {
                try {
                    exec_update().then(() => {
                        resolve()
                    })
                } catch (ex) {
                    reject(ex)
                }
            })
        }

        let executes = detalle.map(element => {
            return update_data_preview(element.id, element.CantidadDevuelto)
        })

        await Promise.all(executes)

        const data = await SolicitudArticuloRepository.findById(newSolicitudArticulo.IdSocilitud, 'DEV');
        await fetch(process.env.API_MAILING, {
            method: 'POST',
            body: JSON.stringify({
                'email': user.correo,
                'subject': 'SOLICITUD DEVOLUCIÓN',
                'template': 'solicitud-devolucion.template',
                'data': data
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        res.json(true)
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: e.message });
    }
}



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

            if (!row.Documento) {
                row.Documento = ''
            }

            if (!row.IdUsuario) {
                row.IdUsuario = ''
            }

            if (!row.ItemCode) {
                row.ItemCode = ''
            }

            if (!row.IdAlmacen) {
                row.IdAlmacen = ''
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

            const find_empleados = await Usuario.findOne({
                where: {
                    NroDocumento: row.Documento,
                    IdEmpresa: id_empresa_activo
                }
            })

            if (!find_empleados) {
                msg.push('No se encontró el usuario')
            } else {
                if (find_empleados.IdUsuario === id_usuario_activo) {
                    row.IdUsuario = find_empleados.IdUsuario
                } else {
                    const find_group = await GrupoTrabajador.findOne({
                        where: {
                            Activo: true,
                            IdUsuarioNivel: id_usuario_activo,
                            IdUsuarioSubNivel: find_empleados.IdUsuario
                        }
                    })
                    if (!find_group) {
                        msg.push('No se encontró el usuario en el listado')
                    } else {
                        row.IdUsuario = find_empleados.IdUsuario
                    }
                }
            }

            const find_existe_articulo = await Articulo.findOne({
                where: {
                  ItemCode: row.ItemCode,
                },
                include: {
                  model: GrupoArticulo,
                  where: {
                    IdNegocio: row.IdNegocio,
                  },
                },
              });

            if (!find_existe_articulo) {
                msg.push('No se encontró el articulo')
            } else {
                row.IdArticulo = find_existe_articulo.IdArticulo
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
                    IdAlmacen: row.IdAlmacen,
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

            let find_user

            if (row.IdUsuario === id_usuario_activo) {
                find_user = await Usuario.findOne({
                    include: {
                        model: UsuarioNegocio,
                        where: {
                            IdNegocio: row.IdNegocio
                        }
                    },
                    where: {
                        IdUsuario: row.IdUsuario,
                        Activo: true
                    }
                })

                if (!find_user) {
                    msg.push('No se encontró el usuario')
                } else {
                    if (!find_user.UsuarioNegocios) {
                        msg.push('No se encontró el usuario negocio')
                    }
                }
            } else {
                const find_group = await GrupoTrabajador.findOne({
                    where: {
                        IdUsuarioNivel: id_usuario_activo,
                        IdUsuarioSubNivel: row.IdUsuario
                    }
                })

                if (!find_group) {
                    msg.push('No se encontró el grupo')
                }

                if (find_group) {
                    find_user = await Usuario.findOne({
                        include: {
                            model: UsuarioNegocio,
                            where: {
                                IdNegocio: row.IdNegocio
                            }
                        },
                        where: {
                            IdUsuario: row.IdUsuario
                        }
                    })

                    if (!find_user) {
                        msg.push('No se encontró el usuario')
                    } else {
                        if (find_user.UsuarioNegocios.length === 0) {
                            msg.push('No se encontró el usuario negocio')
                        }
                    }
                }
            }

            const find_almacen = await Almacen.findOne({
                where: {
                    IdAlmacen: row.IdAlmacen
                }
            })

            if (!find_almacen) {
                msg.push('No se encontró el almacen')
            }

            if (msg.length > 0) {
                result.push({
                    id: uuidv4(),
                    CodArticulo: '',
                    Documento: row.Documento,
                    ItemCode: row.ItemCode,
                    Articulo: '',
                    DNI: '',
                    Cantidad: row.Cantidad,
                    IdUsuario: row.IdUsuario,
                    IdArticuloNegocio: '',
                    CodAlmacen: row.IdAlmacen,
                    Almacen: '',
                    IdNegocio: row.IdNegocio,
                    IdUsuarioNegocio: '',
                    CCosto: '',
                    CodigoCCosto: '',
                    IdArticulo: row.IdArticulo,
                    Nombre: '',
                    U_BPP_TIPUNMED: '',
                    U_Devolucion: '',
                    U_Evaluacion: '',
                    Grupo: '',
                    IdStock: '',
                    __status: 'Error',
                    __message: msg.join(',')
                })
            } else {
                result.push({
                    id: uuidv4(),
                    CodArticulo: find_article.ItemCode,
                    Documento: row.Documento,
                    ItemCode: row.ItemCode,
                    Articulo: find_article.ItemName,
                    DNI: find_user.NroDocumento,
                    Cantidad: Cantidad,
                    IdUsuario: row.IdUsuario,
                    IdArticuloNegocio: find_article.ArticuloNegocios[0].IdArticuloNegocio,
                    CodAlmacen: row.IdAlmacen,
                    Almacen: find_almacen.Nombre,
                    IdNegocio: row.IdNegocio,
                    IdUsuarioNegocio: find_user.UsuarioNegocios[0].IdUsuarioNegocio,
                    CCosto: '',
                    CodigoCCosto: '',
                    IdArticulo: find_article.IdArticulo,
                    Nombre: `${find_user.ApellidoPaterno} ${find_user.ApellidoMaterno} ${find_user.Nombres}`,
                    U_BPP_TIPUNMED: find_article.Parametro.Nombre,
                    U_Devolucion: find_article.GrupoArticulo.U_Devolucion,
                    U_Evaluacion: find_article.GrupoArticulo.U_Evaluacion,
                    Grupo: find_article.GrupoArticulo.Nombre,
                    IdStock: find_stock.IdStock,
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


export const getDataDetail = async (req, res) => {
    const { user, company } = req.headers
    const usuario_activo = user.username
    const id_usuario_activo = user.id_user
    const id_empresa_activo = company.id

    const {
        motivo,
        detalle
    } = req.body

    try {

        const find_almacen = await Almacen.findAll({
            attributes: [
                "IdAlmacen",
                "Nombre",
            ],
            where: {
                Activo: true,
                IdEmpresa: id_empresa_activo
            }
        })

        const find_negocio = await TipoNegocio.findAll({
            attributes: [
                "IdNegocio",
                "Nombre"
            ],
            where: {
                Activo: true,
                IdEmpresa: id_empresa_activo
            }
        })

        const find_articulo = await Stock.findAll({
            attributes: [
                [Sequelize.col('Almacene.Nombre'), "Almacen"],
                [Sequelize.col('TipoNegocio.Nombre'), "Unidad de Negocio"],
                [Sequelize.col('Articulo.ItemCode'), "ItemCode"],
                [Sequelize.col('Articulo.ItemName'), "Nombre del articulo"],
                "Cantidad",
                ["Tipo", "Estado"]
            ],
            include: [{
                model: Almacen,
                attributes: [],
                where: {
                    Activo: true
                },
                required: true
            }, {
                model: Articulo,
                attributes: [],
                where: {
                    Activo: true
                },
                required: true
            }, {
                model: TipoNegocio,
                attributes: [],
                where: {
                    Activo: true,                    
                    IdEmpresa: id_empresa_activo
                },
                required: true
            }],
            where: {
                Tipo: TYPE_STOCK.DISPONIBLE,
                Cantidad: {
                    [Op.gt]: 0
                }
            },
            order: [
                [Sequelize.col('TipoNegocio.Nombre'), 'ASC'],
                [Sequelize.col('Articulo.ItemCode'), 'ASC'],
            ],
        })

        const find_grupo_trabajador =  await GrupoTrabajador.findAll({
            attributes: [
                [Sequelize.col('Usuario.NroDocumento'), "NroDocumento"],
                [Sequelize.col('Usuario.Nombres'), "Nombres"],
                [Sequelize.col('Usuario.ApellidoPaterno'), "ApellidoPaterno"],
                [Sequelize.col('Usuario.ApellidoMaterno'), "ApellidoMaterno"] 
            ],
            include: {
                model: Usuario,
                attributes: [],
                required: true,
                where: {
                    IdEmpresa: id_empresa_activo
                }
            },
            where: {
                IdUsuarioNivel: id_usuario_activo,
                Activo: true
            },
            order: [[Sequelize.col('Usuario.NroDocumento'), 'ASC']],
        })

        const list_almacen = find_almacen.map(element => element.toJSON())

        const list_negocio = find_negocio.map(element => element.toJSON())

        const list_articulo = find_articulo.map(element => element.toJSON())

        const list_grupo_trabajador = find_grupo_trabajador.map(element => element.toJSON())

        const buffer = await make_book([
            {
                name: 'Almacen',
                list: list_almacen
            }, {
                name: 'Negocio',
                list: list_negocio
            }, {
                name: 'Articulo',
                list: list_articulo
            }, {
                name: 'Persona Asignada',
                list: list_grupo_trabajador
            }

        ])

        res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');
        res.setHeader('Content-Transfer-Encoding', 'binary');
        res.setHeader('Content-Type', 'application/octet-stream');
        res.send(new Buffer(buffer, 'binary'))
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: e.message });
    }
}