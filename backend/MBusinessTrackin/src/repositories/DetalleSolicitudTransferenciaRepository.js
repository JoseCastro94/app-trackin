import {sequelize} from "../database/database.js";
import Sequelize, {Op, QueryTypes} from "sequelize";
import {LISTAR_DETALLE_POR_ID_SOLICITUD_TRANSFERENCIA} from "../database/queries/detalle-solicitud-transferencia-query.js";
import {OBTENER_SERIES_ARTICULO} from "../database/queries/obtener-series-articulos-detalle.js";
import {DetalleSolicitudArticulo} from "../models/DetalleSolicitudArticulo.js";
import {ArticuloNegocio} from "../models/ArticuloNegocio.js";
import {Articulo} from "../models/Articulo.js";
import {Parametro} from "../models/Parametro.js";
import {Almacen} from "../models/Almacen.js";
import {TipoNegocio} from "../models/TipoNegocio.js";
import {UsuarioNegocio} from "../models/UsuarioNegocio.js";
import {Usuario} from "../models/Usuario.js";
import {GrupoArticulo} from "../models/GrupoArticulo.js";
import {DetalleDespachoSolicitud} from "../models/DetalleDespachoSolicitud.js";

class DetalleSolicitudTransferenciaRepository {

    static listarPorIdSolicitud = async (id_solicitud, IdEmpresa, IdAlmacenes) => {
        const detalle = await sequelize.query(LISTAR_DETALLE_POR_ID_SOLICITUD_TRANSFERENCIA, {
            replacements: { id_solicitud, IdEmpresa, IdAlmacenes },
            type: QueryTypes.SELECT
        })

        for(let i = 0; i< detalle.length; i++){
            let item = detalle[i];
            item.series = await sequelize.query(OBTENER_SERIES_ARTICULO, {
                replacements: {
                    idarticulo: item.idarticulo , 
                    idempresa: IdEmpresa , 
                    idalmacen : IdAlmacenes ,
                    idnegocio : item.IdNegocio ,
                    idsolicitud : id_solicitud
                },
                type: QueryTypes.SELECT
            })
            detalle[i] = item;

        }
       
        /*
         detalle.forEach(item => {
            item.series = sequelize.query(OBTENER_SERIES_ARTICULO, {
                replacements: {
                    idarticulo: item.idarticulo , 
                    idempresa: IdEmpresa , 
                    idalmacen : IdAlmacenes ,
                    idnegocio : item.IdNegocio ,
                    idsolicitud : id_solicitud
                },
                type: QueryTypes.SELECT
            })
        });

        */
        
        //  item.series = [1 , 2 , 3]
        console.dir('listarPorIdSolicitud');
        console.dir(detalle);
        return detalle;
    }

    static listarDevolucionPorIdSolicitud = async (id_solicitud, IdEmpresa, IdAlmacenes) => {
        return DetalleSolicitudArticulo.findAll({
            attributes: [
                ['IdDetalleSocilitud', 'id'],
                ['ItemCode', 'codigo'],
                ['ItemName', 'descripcion'],
                ['Cantidad', 'cantidad'],
                ['IdNegocio', 'id_negocio'],
                ['SerialNumber', 'serie'],
                [Sequelize.fn('IFNULL', Sequelize.col('DetalleDespachoSolicituds.Cantidad'), 0), 'cantidad_devolucion'],
                [Sequelize.fn('IF', Sequelize.literal('U_BPP_DEVOL = "Y"'), ['SI', 'NO']), 'devolucion'],
                ['Observacion', 'comentario'],
                [Sequelize.col('Parametro.Nombre'), 'estado'],
                [Sequelize.col('Parametro.Valor1'), 'color'],
                [Sequelize.col('`TipoNegocio`.`Nombre`'), 'cuenta'],
                [Sequelize.col('`Almacene`.`IdAlmacen`'), 'id_almacen'],
                [Sequelize.col('`Almacene`.`Nombre`'), 'almacen'],
                [Sequelize.col('`UsuarioNegocio->Usuario`.`IdUsuario`'), 'id_asignado'],
                [Sequelize.col('`UsuarioNegocio->Usuario`.`Nombres`'), 'asignado'],
                [Sequelize.col('`UsuarioNegocio->Usuario`.`NroDocumento`'), 'num_doc'],
                [Sequelize.col('`ArticuloNegocio`.`IdArticulo`'), 'id_articulo'],
                [Sequelize.col('`ArticuloNegocio->Articulo->GrupoArticulo`.`Nombre`'), 'grupo_articulo'],
                [Sequelize.fn('IF',
                    Sequelize.literal('`ArticuloNegocio->Articulo->GrupoArticulo`.`U_Evaluacion` = "Y"'),
                    ['SI', 'NO']),
                    'evaluacion'
                ],
            ],
            include: [{
                model: Parametro,
                attributes: [],
                required: true
            }, {
                model: Almacen,
                attributes: [],
                required: true
            }, {
                model: TipoNegocio,
                attributes: [],
                required: true,
                where: {
                    IdEmpresa
                }
            }, {
                model: UsuarioNegocio,
                attributes: [],
                required: true,
                include: [{
                    model: Usuario,
                    attributes: [],
                    required: true
                }]
            }, {
                model: ArticuloNegocio,
                required: true,
                attributes: [],
                include: [{
                    model: Articulo,
                    required: true,
                    attributes: [],
                    include: [{
                        model: GrupoArticulo,
                        attributes: [],
                        required: true,
                    }]
                }]
            }, {
                model: DetalleDespachoSolicitud,
                attributes: [],
                required: false
            }],
            where: {
                IdSocilitud: id_solicitud,
                IdAlmacen:  { [Op.in]: IdAlmacenes }
            },
            raw: true
        })
    }

    static faltaDevolver = async (IdSocilitud) => {
        const noEstados = ['91cf2544-a507-4ff1-b7b1-174a1e158dd0', '68ecd2cf-f2e0-4739-a8c1-409b25777cc6', '99df2544-a507-4ff1-b7b1-174a1e158dd0']
        return DetalleSolicitudArticulo.findOne({
            where: {
                IdSocilitud,
                //IdEstado: { [Op.ne]: estadoEntregado }
                IdEstado: { [Op.notIn]: noEstados }
            },
            raw: true
        })
    }

    static update = async (params = {}, where = {}, transaction) => {
        return DetalleSolicitudArticulo.update(params, {
            where,
            transaction
        })
    }

    static incrementCantidadDespachado = async (id_detalle, cantidad, transaction) => {
        await DetalleSolicitudArticulo.increment({
            CantidadProgramada: cantidad
        }, {
            where: {
                IdDetalleSocilitud: id_detalle
            },
            transaction: transaction
        })
    }
}

export default DetalleSolicitudTransferenciaRepository
