import {sequelize} from "../database/database.js";
import Sequelize, {QueryTypes, Op} from "sequelize";
import {DespachoSolicitud} from "../models/DespachoSolicitud.js";
import {DetalleDespachoSolicitud} from "../models/DetalleDespachoSolicitud.js";
import {LISTAR_DESPACHO_SOLICITUD, LISTAR_CANTIDAD_ENTREGADO} from "../database/queries/despacho-solicitud.js";
import {Almacen} from "../models/Almacen.js";
import {Usuario} from "../models/Usuario.js";
import {SolicitudArticulo} from "../models/SolicitudArticulo.js";
import {Parametro} from "../models/Parametro.js";
import {DetalleSolicitudArticulo} from "../models/DetalleSolicitudArticulo.js";
import {TipoNegocio} from "../models/TipoNegocio.js";
import {ArticuloNegocio} from "../models/ArticuloNegocio.js";
import {Articulo} from "../models/Articulo.js";
import {GrupoArticulo} from "../models/GrupoArticulo.js";

class DespachoSolicitudArticuloRepository {
    static getCodigo = async (tipo = 'DES') => {
        return DespachoSolicitud.findOne({
            attributes: [
                [Sequelize.fn('CONCAT',
                    `${tipo}-`,
                    Sequelize.fn('YEAR', Sequelize.literal('NOW()')), '-',
                    Sequelize.fn('LPAD', Sequelize.literal('COUNT(IdDespacho) + 1'), 6, '0')
                ), 'codigo']
            ],
            where: {
                Codigo: { [Op.like]: `${tipo}-%`},
                date: Sequelize.where(
                    Sequelize.fn('YEAR', Sequelize.col('FechaCreacion')),
                    Sequelize.fn('YEAR', Sequelize.literal('NOW()')))
            },
            raw: true
        }).then(data => data.codigo)
    }

    static listar = async (tipo='DESPACHO', IdEmpresa, IdAlmacenes, fechaIni, fechaFin, filtro, _estado) => {
        return sequelize.query(LISTAR_DESPACHO_SOLICITUD, {
            replacements: {tipo, IdEmpresa, IdAlmacenes, fechaIni, fechaFin, filtro, _estado},
            type: QueryTypes.SELECT
        })
    }

    static create = async (params, transaction) => {
        return DespachoSolicitud.create(params, {
            include: [DetalleDespachoSolicitud],
            transaction
        }).then(data => data.toJSON())
    }

    static update = async (params = {}, where = {}, transaction) => {
        return DespachoSolicitud.update(params, {
            where,
            transaction
        })
    }

    static listarCantidadEntregado = (id_despacho) => {
        return sequelize.query(LISTAR_CANTIDAD_ENTREGADO, {
            replacements: {id_despacho},
            type: QueryTypes.SELECT
        })
    }

    static listarDespachosSolicitudes = ({IdEmpresa, IdAlmacenes, fechaIni, fechaFin, estado, filtro}) => {
        IdEmpresa = '89e324de-098d-4890-a72d-02401de72f22'
        IdAlmacenes = ['16cc1c6d-2b3f-4316-839e-89bf0b461572', 'fcf5b90f-f18a-4657-a021-fa068e11bABC']
        fechaIni = '2022-12-01'
        fechaFin = '2022-12-20'
        const where = {
            IdEmpresa,
            IdAlmacen: {[Op.in]: IdAlmacenes},
            date: Sequelize.where(
                Sequelize.fn('DATE', Sequelize.col('DespachoSolicitud.FechaProgramada')),
                {
                    [Op.between]: [fechaIni, fechaFin]
                }),
            IdEstado: {[Op.ne]: '75cf2544-a507-4ff1-b7b1-174a1e158dd0'},
            Tipo: 'DESPACHO',
            [Op.or]: [
                Sequelize.where(
                    Sequelize.fn('CONCAT', 'SOL-',
                        Sequelize.col('SolicitudArticulo.Periodo'), '-',
                        Sequelize.fn('LPAD', Sequelize.col('SolicitudArticulo.Correlativo'), 6, '0')
                    ),
                    {[Op.like]: `%${filtro}%`}
                ), {
                    'Codigo': {
                        [Op.like]: `%${filtro}%`
                    }
                },
                Sequelize.where(
                    Sequelize.col('Usuario.NroDocumento'),
                    {[Op.like]: `%${filtro}%`}
                ),
                Sequelize.where(
                    Sequelize.fn('CONCAT',
                        Sequelize.col('Usuario.ApellidoPaterno'), ' ',
                        Sequelize.col('Usuario.ApellidoMaterno'), ' ',
                        Sequelize.col('Usuario.Nombres')),
                    {[Op.like]: `%${filtro}%`}
                )
            ]
        };

        if (estado) {
            where.IdEstado = {[Op.eq]: estado}
        }

        return DespachoSolicitud.findAll({
            attributes: [
                ['IdDespacho', 'id'],
                ['Codigo', 'codigo_despacho'],
                [Sequelize.fn('CONCAT', 'SOL-',
                    Sequelize.col('SolicitudArticulo.Periodo'), '-',
                    Sequelize.fn('LPAD', Sequelize.col('SolicitudArticulo.Correlativo'), 6, '0')
                ), 'codigo_solicitud'],
                ['Observacion', 'comentario'],
                ['IdGuia', 'IdGuia'],
                [Sequelize.fn('DATE_FORMAT', Sequelize.col('FechaProgramada'), '%d/%m/%Y'), 'fecha'],
                [Sequelize.fn('TIME_FORMAT', Sequelize.col('FechaProgramada'), '%H:%i'), 'hora'],
                [Sequelize.col('Parametro.Nombre'), 'estado'],
                [Sequelize.col('Parametro.Valor1'), 'color'],
                [Sequelize.col('SolicitudArticulo.IdSocilitud'), 'id_solicitud'],
                [Sequelize.fn('CONCAT',
                    Sequelize.col('Usuario.ApellidoPaterno'), ' ',
                    Sequelize.col('Usuario.ApellidoMaterno'), ' ',
                    Sequelize.col('Usuario.Nombres')
                ), 'asignado'],
                [Sequelize.col('Usuario.NroDocumento'), 'documento'],
                [Sequelize.col('Almacene.Nombre'), 'almacen'],
                [Sequelize.fn('IF',
                    Sequelize.literal('COUNT(distinct `SolicitudArticulo->DetalleSolicitudArticulos`.`IdNegocio`) > 1'),
                    [0, 1]),
                    'only_cuenta'
                ],
                [Sequelize.col('`SolicitudArticulo->DetalleSolicitudArticulos->TipoNegocio`.`Nombre`'), 'cuenta'],
            ],
            where,
            group: 'DespachoSolicitud.IdDespacho',
            order: [[Sequelize.col('DespachoSolicitud.FechaCreacion'), 'DESC']],
            include: [
                {
                    model: SolicitudArticulo,
                    attributes: [],
                    required: true,
                    include: [{
                        model: DetalleSolicitudArticulo,
                        attributes: [],
                        required: true,
                        include: {
                            model: TipoNegocio,
                            attributes: [],
                            required: true
                        }
                    }]
                },
                {
                    model: Parametro,
                    attributes: [],
                    required: true
                },
                {
                    model: Usuario,
                    attributes: [],
                    required: true
                },
                {
                    model: Almacen,
                    attributes: [],
                    required: true
                },
                {
                    model: DetalleDespachoSolicitud,
                    attributes: [
                        ['IdEstadoEntrega', 'estado_entrega'],
                        ['ItemCode', 'codigo_producto'],
                        ['ItemName', 'nombre_producto'],
                        ['CantidadPicking', 'cantidad_picking'],
                        ['CantidadEntrega', 'cantidad_entregada'],
                        [Sequelize.literal('0'), 'entrega'],
                        ['IdDetalleDespacho', 'id_detalle_despacho'],
                        [Sequelize.fn('IFNULL', Sequelize.col('DetalleDespachoSolicituds.SerialNumber'), ''), 'serie'],
                        [Sequelize.literal('`DetalleDespachoSolicituds->Parametro`.`Nombre`'), 'estado'],
                        [Sequelize.literal('`DetalleDespachoSolicituds->Parametro`.`Valor1`'), 'color'],
                        [Sequelize.literal('`DetalleDespachoSolicituds->DetalleSolicitudArticulo->TipoNegocio`.`Nombre`'), 'cuenta'],
                        [Sequelize.literal('`DetalleDespachoSolicituds->DetalleSolicitudArticulo->Almacene`.`Nombre`'), 'almacen'],
                        [Sequelize.literal('`DetalleDespachoSolicituds->DetalleSolicitudArticulo`.`IdDetalleSocilitud`'), 'id_detalle_solicitud'],
                        [Sequelize.literal('`DetalleDespachoSolicituds->DetalleSolicitudArticulo`.`IdAlmacen`'), 'id_almacen'],
                        [Sequelize.literal('`DetalleDespachoSolicituds->DetalleSolicitudArticulo`.`IdNegocio`'), 'id_negocio'],
                        [Sequelize.literal('`DetalleDespachoSolicituds->DetalleSolicitudArticulo`.`Cantidad`'), 'cantidad_solicitada'],
                        [Sequelize.literal('`DetalleDespachoSolicituds->DetalleSolicitudArticulo->ArticuloNegocio`.`IdArticulo`'), 'id_articulo'],
                        [Sequelize.literal('`DetalleDespachoSolicituds->DetalleSolicitudArticulo->ArticuloNegocio->Articulo->GrupoArticulo`.`TieneSerie`'), 'has_serie'],
                        [Sequelize.literal('`DetalleDespachoSolicituds->DetalleSolicitudArticulo->ArticuloNegocio->Articulo->GrupoArticulo`.`Nombre`'), 'categoria'],
                        [Sequelize.literal('`DetalleDespachoSolicituds->DetalleSolicitudArticulo->ArticuloNegocio->Articulo->GrupoArticulo`.`U_Devolucion`'), 'devolucion'],
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
                            include: [{
                                model: TipoNegocio,
                                attributes: [],
                                required: true
                            }, {
                                model: Almacen,
                                attributes: [],
                                required: true
                            }, {
                                model: ArticuloNegocio,
                                attributes: [],
                                include: [{
                                    model: Articulo,
                                    attributes: [],
                                    include: [{
                                        model: GrupoArticulo,
                                        attributes: [],
                                        required: true
                                    }],
                                    required: true
                                }],
                                required: true
                            }],
                            required: true
                        }
                    ],
                    required: true
                }
            ],
        }).then(data => JSON.stringify(data))
          //.then(data => JSON.parse(data))
    }

    static findById = async (id) => {
        return DespachoSolicitud.findByPk(id, {
            attributes: [
                [Sequelize.col('Codigo'), 'codigo'],
                [Sequelize.col('Almacene.Nombre'), 'almacen'],
                [Sequelize.col('Usuario.Nombres'), 'asignado'],
                [Sequelize.col('Usuario.NroDocumento'), 'documento'],
                [Sequelize.fn('CONCAT', 'SOL-',
                    Sequelize.col('SolicitudArticulo.Periodo'), '-',
                    Sequelize.fn('LPAD', Sequelize.col('SolicitudArticulo.Correlativo'), 6, '0')
                ), 'solicitud'],
                [Sequelize.col('SolicitudArticulo.MotivoSolicitud'), 'descripcion'],
                [Sequelize.col('Parametro.Nombre'), 'estado'],
                [Sequelize.fn('DATE_FORMAT', Sequelize.col('FechaProgramada'), '%d/%m/%Y'), 'fecha'],
                [Sequelize.fn('TIME_FORMAT', Sequelize.col('FechaProgramada'), '%H:%i'), 'hora'],
            ],
            include: [{
                model: Almacen,
                attributes: [],
                required: true
            }, {
                model: Usuario,
                attributes: [],
                required: true
            }, {
                model: SolicitudArticulo,
                attributes: [],
                required: true
            }, {
                model: Parametro,
                attributes: [],
                required: true
            }, {
                model: DetalleDespachoSolicitud,
                attributes: [
                    [Sequelize.col('ItemCode'), 'codigo'],
                    [Sequelize.col('ItemName'), 'nombre'],
                    [Sequelize.col('CantidadPicking'), 'picking'],
                    [Sequelize.col('CantidadEntrega'), 'entrega'],
                    [Sequelize.col('SerialNumber'), 'serie'],
                    [Sequelize.literal('`DetalleDespachoSolicituds->Parametro`.`Nombre`'), 'estado'],
                    [Sequelize.literal('`DetalleDespachoSolicituds->DetalleSolicitudArticulo->Almacene`.`Nombre`'), 'almacen'],
                    [Sequelize.literal('`DetalleDespachoSolicituds->DetalleSolicitudArticulo->TipoNegocio`.`Nombre`'), 'negocio'],
                ],
                required: true,
                include: [{
                    model: Parametro,
                    attributes: [],
                    required: true
                }, {
                    model: DetalleSolicitudArticulo,
                    attributes: [],
                    required: true,
                    include: [{
                        model: Almacen,
                        attributes: [],
                        required: true
                    }, {
                        model: TipoNegocio,
                        attributes: [],
                        required: true
                    }]
                }]
            }],
        }).then(data => data.toJSON())
    }
}

export default DespachoSolicitudArticuloRepository
