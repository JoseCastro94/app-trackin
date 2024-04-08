import {sequelize} from "../database/database.js";
import Sequelize, {QueryTypes, Op} from "sequelize";
import {LISTAR_SOLICITUDES_POR_IDS} from '../database/queries/solicitud-articulo.js'
import {SolicitudArticulo} from "../models/SolicitudArticulo.js";
import {DetalleSolicitudArticulo} from "../models/DetalleSolicitudArticulo.js";
import {UsuarioNegocio} from "../models/UsuarioNegocio.js";
import {Parametro} from "../models/Parametro.js";
import {TipoNegocio} from "../models/TipoNegocio.js";
import {Almacen} from "../models/Almacen.js";
import {Usuario} from "../models/Usuario.js";
import {DespachoSolicitud} from "../models/DespachoSolicitud.js";

class SolicitudArticuloRepository {
    static list = async (IdEstado, IdEmpresa, IdAlmacenes) => {
        return SolicitudArticulo.findAll({
            attributes: [
                ['IdSocilitud', 'id'],
                ['MotivoSolicitud', 'motivo_solicitud'],
                [Sequelize.fn('CONCAT', `SOL-`,
                    Sequelize.col('Periodo'), '-',
                    Sequelize.fn('LPAD', Sequelize.col('Correlativo'), 6, '0')),
                    'codigo'
                ],
                [Sequelize.fn('DATE_FORMAT', Sequelize.col('FechaSolicitud'), '%d/%m/%Y'), 'fecha_solicitud'],
                [Sequelize.literal('false'), 'picking'],
                [Sequelize.col('Parametro.Nombre'), 'estado'],
                [Sequelize.col('Parametro.Valor1'), 'color'],
                [Sequelize.col('DetalleSolicitudArticulos.IdDetalleSocilitud'), 'id_detalle'],
                [Sequelize.fn('IF',
                    Sequelize.literal('COUNT(distinct DetalleSolicitudArticulos.IdUsuario) > 1'),
                    [0, 1]),
                    'only_asignado'
                ],
                [Sequelize.fn('CONCAT',
                    Sequelize.col('`DetalleSolicitudArticulos->UsuarioNegocio->Usuario`.`ApellidoPaterno`'), ' ',
                    Sequelize.col('`DetalleSolicitudArticulos->UsuarioNegocio->Usuario`.`ApellidoMaterno`'), ' ',
                    Sequelize.col('`DetalleSolicitudArticulos->UsuarioNegocio->Usuario`.`Nombres`')
                ), 'asignado'],
                [Sequelize.fn('IF',
                    Sequelize.literal('COUNT(distinct DetalleSolicitudArticulos.IdNegocio) > 1'),
                    [0, 1]),
                    'only_cuenta'
                ],
                [Sequelize.col('`DetalleSolicitudArticulos->TipoNegocio`.`Nombre`'), 'cuenta'],
            ],
            include: [
                {
                    model: Parametro,
                    attributes: [],
                    required: true
                },
                {
                    model: DetalleSolicitudArticulo,
                    attributes: [],
                    required: true,
                    where: {
                        IdAlmacen: { [Op.in]: IdAlmacenes }
                    },
                    include: [
                        {
                            model: UsuarioNegocio,
                            attributes: [],
                            required: true,
                            include: [{
                                model: Usuario,
                                attributes: [],
                                required: true
                            }]
                        },
                        {
                            model: TipoNegocio,
                            attributes: [],
                            required: true
                        }
                    ]
                }
            ],
            where: {
                IdEstado,
                IdEmpresa,
            },
            order: [
                ['FechaCreacion', 'DESC']
            ],
            group: [
                'SolicitudArticulos.IdSocilitud'
            ],
            raw: true
        }).then(solicitudes => solicitudes.map(solicitud => {
            if (!solicitud.only_asignado) solicitud.asignado = 'VARIOS'
            if (!solicitud.only_cuenta) solicitud.cuenta = 'VARIAS'
            return solicitud
        }))
    }

    static findById = async (IdSocilitud, tipo = 'SOL') => {
        return SolicitudArticulo.findByPk(IdSocilitud, {
            attributes: [
                ['IdSocilitud', 'id'],
                ['MotivoSolicitud', 'motivo'],
                [Sequelize.fn('DATE_FORMAT', Sequelize.col('FechaPropuesta'), '%d/%m/%Y'), 'fecha'],
                [Sequelize.fn('TIME_FORMAT', Sequelize.col('FechaPropuesta'), '%H:%i'), 'hora'],
                [Sequelize.fn('CONCAT', `${tipo}-`,
                    Sequelize.col('Periodo'), '-',
                    Sequelize.fn('LPAD', Sequelize.col('Correlativo'), 6, '0')),
                    'codigo'
                ],
                [Sequelize.col('`DetalleSolicitudArticulos->UsuarioNegocio->Usuario`.`Nombres`'), 'asignado'],
                [Sequelize.col('`DetalleSolicitudArticulos->UsuarioNegocio->Usuario`.`NroDocumento`'), 'num_doc'],
                [Sequelize.col('Parametro.Nombre'), 'estado'],
            ],
            include: [
                {
                    model: Parametro,
                    attributes: [],
                    required: true
                },
                {
                    model: DetalleSolicitudArticulo,
                    attributes: [
                        [Sequelize.col('ItemCode'), 'codigo'],
                        [Sequelize.col('ItemName'), 'nombre'],
                        [Sequelize.col('Cantidad'), 'cantidad'],
                    ],
                    required: true,
                    include: [
                        {
                            model: UsuarioNegocio,
                            attributes: [],
                            required: true,
                            include: [{
                                model: Usuario,
                                attributes: [],
                                required: true
                            }]
                        },
                        {
                            model: TipoNegocio,
                            attributes: [],
                            required: true
                        },
                        {
                            model: Almacen,
                            attributes: [],
                            required: true
                        }
                    ]
                }
            ]
        }).then(data => data.toJSON())
    }

    static listarSolicitudesPorId = async (solicitudes, IdEmpresa, IdAlmacenes, tipo = 'PEDIDO') => {
        if (tipo === 'PEDIDO') {
            return sequelize.query(LISTAR_SOLICITUDES_POR_IDS, {
                replacements: { ids: solicitudes, IdEmpresa, IdAlmacenes },
                type: QueryTypes.SELECT
            })
        }
        return await SolicitudArticulo.findAll({
            attributes: [
                ['IdSocilitud', 'id'],
                ['MotivoSolicitud', 'motivo'],
                ['FechaPropuesta', 'fecha_propuesta'],
                [Sequelize.fn('DATE_FORMAT', Sequelize.col('FechaPropuesta'), '%d/%m/%Y'), 'fecha'],
                [Sequelize.fn('TIME_FORMAT', Sequelize.col('FechaPropuesta'), '%H:%i'), 'hora'],
                [Sequelize.fn('CONCAT', 'DEV-',
                    Sequelize.col('Periodo'), '-',
                    Sequelize.fn('LPAD', Sequelize.col('Correlativo'), 6, '0')),
                    'codigo'
                ],
                [Sequelize.fn('IF',
                    Sequelize.literal('COUNT(distinct DetalleSolicitudArticulos.IdUsuarioNegocio) > 1'),
                    [0, 1]),
                    'only_asignado'
                ],
                [Sequelize.col('`DetalleSolicitudArticulos->UsuarioNegocio->Usuario`.`IdUsuario`'), 'id_asignado'],
                [Sequelize.col('`DetalleSolicitudArticulos->UsuarioNegocio->Usuario`.`Nombres`'), 'asignado'],
                [Sequelize.col('`DetalleSolicitudArticulos->UsuarioNegocio->Usuario`.`NroDocumento`'), 'num_doc'],
                [Sequelize.col('Parametro.Nombre'), 'estado'],
                [Sequelize.col('Parametro.Valor1'), 'color'],
                [Sequelize.fn('IF',
                    Sequelize.literal('COUNT(distinct `DetalleSolicitudArticulos->TipoNegocio`.`IdNegocio`) > 1'),
                    [0, 1]),
                    'only_cuenta'
                ],
                [Sequelize.col('`DetalleSolicitudArticulos->TipoNegocio`.`Nombre`'), 'cuenta'],
                [Sequelize.col('`DetalleSolicitudArticulos->Almacene`.`IdAlmacen`'), 'id_almacen'],
                [Sequelize.col('`DetalleSolicitudArticulos->Almacene`.`Nombre`'), 'almacen'],
                [Sequelize.fn('IFNULL', Sequelize.col('`DespachoSolicituds.Observacion`'), ''), 'comentario']
            ],
            include: [
                {
                    model: Parametro,
                    attributes: [],
                    required: true
                },
                {
                    model: DetalleSolicitudArticulo,
                    attributes: [],
                    required: true,
                    where: {
                        IdAlmacen: {[Op.in]: IdAlmacenes}
                    },
                    include: [
                        {
                            model: UsuarioNegocio,
                            attributes: [],
                            required: true,
                            include: [{
                                model: Usuario,
                                attributes: [],
                                required: true
                            }]
                        },
                        {
                            model: TipoNegocio,
                            attributes: [],
                            required: true
                        },
                        {
                            model: Almacen,
                            attributes: [],
                            required: true
                        }
                    ]
                }, {
                    model: DespachoSolicitud,
                    attributes: [],
                    required: false
                }
            ],
            where: {
                Tipo: tipo,
                IdSocilitud: {[Op.in]: solicitudes}
            },
            order: [
                ['FechaCreacion', 'DESC']
            ],
            group: [
                'SolicitudArticulos.IdSocilitud'
            ],
            raw: true
        })
    }

    static update = async (data, transaction) => {
        console.log('TRABSACTION', data.params)
        console.log('TRABSACTION-ID', data.id)
        return SolicitudArticulo.update(data.params, {
            where: {
                IdSocilitud: data.id
            },
            transaction
        })
    }

    static listarDevoluciones = async (IdEstado, IdEmpresa, IdAlmacenes) => {
        return SolicitudArticulo.findAll({
            attributes: [
                ['IdSocilitud', 'id'],
                ['MotivoSolicitud', 'motivo'],
                [Sequelize.fn('date_format', Sequelize.col('FechaSolicitud'), '%d/%m/%Y'), 'fecha'],
                [Sequelize.fn('CONCAT', 'DEV-',
                    Sequelize.col('Periodo'), '-',
                    Sequelize.fn('LPAD', Sequelize.col('Correlativo'), 6, '0')),
                    'codigo'
                ],
                [Sequelize.fn('IF',
                    Sequelize.literal('COUNT(distinct DetalleSolicitudArticulos.IdUsuarioNegocio) > 1'),
                    [0, 1]),
                    'only_asignado'
                ],
                [Sequelize.col('`DetalleSolicitudArticulos->Asignado`.`IdUsuario`'), 'id_asignado'],
                [Sequelize.literal("CONCAT(`DetalleSolicitudArticulos->Asignado`.`ApellidoPaterno`, ' ' ,`DetalleSolicitudArticulos->Asignado`.`ApellidoPaterno`, ' ',`DetalleSolicitudArticulos->Asignado`.`Nombres`)"), 'asignado'],
                [Sequelize.col('Parametro.Nombre'), 'estado'],
                [Sequelize.col('Parametro.Valor1'), 'color'],
                [Sequelize.fn('IF',
                    Sequelize.literal('COUNT(distinct `DetalleSolicitudArticulos->TipoNegocio`.`IdNegocio`) > 1'),
                    [0, 1]),
                    'only_cuenta'
                ],
                [Sequelize.col('`DetalleSolicitudArticulos->TipoNegocio`.`Nombre`'), 'cuenta'],
                [Sequelize.col('`DetalleSolicitudArticulos->Almacene`.`IdAlmacen`'), 'id_almacen'],
                [Sequelize.col('`DetalleSolicitudArticulos->Almacene`.`Nombre`'), 'almacen'],
            ],
            include: [
                {
                    model: Parametro,
                    attributes: [],
                    required: true
                },
                {
                    model: DetalleSolicitudArticulo,
                    attributes: [],
                    required: true,
                    where: {
                        //IdEstado: { [Op.in]: ['95cf2544-a507-4ff1-b7b1-174a1e158dd0', 'ff7535f6-3274-4ab8-9975-5a45109048db'] },
                        IdEstado: { [Op.notIn]: ['91cf2544-a507-4ff1-b7b1-174a1e158dd0', '68ecd2cf-f2e0-4739-a8c1-409b25777cc6'] },
                        IdAlmacen: { [Op.in]: IdAlmacenes }
                    },
                    include: [
                        {
                            model: Usuario,
                            //attributes: [],
                            required: true,
                            as: 'Asignado'
                        },
                        {
                            model: TipoNegocio,
                            attributes: [],
                            required: true
                        },
                        {
                            model: Almacen,
                            attributes: [],
                            required: true
                        }
                    ]
                },
            ],
            where: {
                Tipo: 'DEVOLUCION',
                IdEstado: { [Op.in]: !IdEstado ? ['ff7535f6-3274-4ab8-9972-5a45109048db', 'ff7535f6-3274-4ab8-9976-5a45109048db'] : [IdEstado] },
                IdEmpresa
            },
            order: [
                ['FechaCreacion', 'DESC']
            ],
            group: [
                'SolicitudArticulos.IdSocilitud',
                'DetalleSolicitudArticulos.IdUsuarioNegocio',
                'DetalleSolicitudArticulos.IdNegocio'
            ]
        })
    }

    static listarEstados = async (Tipo, IdEmpresa, IdAlmacenes) => {
        return SolicitudArticulo.findAll({
            attributes: [
                [Sequelize.fn('COUNT', Sequelize.literal('DISTINCT SolicitudArticulos.IdSocilitud')), 'cantidad'],
                [Sequelize.col('Parametro.Nombre'), 'estado'],
                [Sequelize.col('Parametro.Valor1'), 'color'],
            ],
            include: [
                {
                    model: Parametro,
                    required: true,
                    attributes: []
                },
                {
                    model: DetalleSolicitudArticulo,
                    attributes: [],
                    required: true,
                    where: {
                        IdAlmacen: { [Op.in]: IdAlmacenes }
                    }
                }
            ],
            where: {
                Tipo,
                IdEmpresa,
                IdEstado: {[Op.notIn]: [
                    '217aeef5-2957-4a87-bfa8-8a6e65ed0737'
                ]}
            },
            group: ['SolicitudArticulos.IdEstado']
        })
    }
}

export default SolicitudArticuloRepository
