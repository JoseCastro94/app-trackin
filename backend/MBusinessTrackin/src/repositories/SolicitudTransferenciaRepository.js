import {sequelize} from "../database/database.js";
import Sequelize, {QueryTypes, Op} from "sequelize";
import {LISTAR_SOLICITUDES_POR_TRANSFERENCIA_IDS} from '../database/queries/solicitud-transferencia.js'
import {LISTAR_ID_DET_SOLICITUD_POR_TRANSFERENCIA_IDS } from '../database/queries/delete-solicitudes.js'
import {DetalleSolicitudArticulo} from "../models/DetalleSolicitudArticulo.js";
import {UsuarioNegocio} from "../models/UsuarioNegocio.js";
import {Parametro} from "../models/Parametro.js";
import {TipoNegocio} from "../models/TipoNegocio.js";
import {Almacen} from "../models/Almacen.js";
import {Usuario} from "../models/Usuario.js";
import {DespachoSolicitud} from "../models/DespachoSolicitud.js";
import { SolicitudTransferencia } from "../models/SolicitudTransferencia.js";
import { DetalleSolicitudTransferencia } from "../models/DetalleSolicitudTransferencia.js";
import { EstadoDetalle } from "../models/EstadoDetalle.js";
import { Estado } from "../models/Estado.js";

class SolicitudTransferenciaRepository {
    static list = async (IdEstado, IdEmpresa, IdAlmacenes) => {
  
        return SolicitudTransferencia.findAll({
            attributes: [
                ['IdSolicitud', 'id'],
                ['MotivoSolicitud', 'motivo_solicitud'],
                [Sequelize.fn('CONCAT', 'SOLTRAN-',
                Sequelize.col('Periodo'), '-',
                Sequelize.fn('LPAD', Sequelize.col('Correlativo'), 6, '0')),
                'codigo'
                ],
                [Sequelize.col('`Almacene`.`Nombre`'), 'almacen_solicitante'],
                [Sequelize.col('Parametro.Nombre'), 'estado'],
                [Sequelize.col('Parametro.Valor1'), 'color'],
                [Sequelize.fn('CONCAT',
                Sequelize.col('`Usuario`.`ApellidoPaterno`'), ' ',
                Sequelize.col('`Usuario`.`ApellidoMaterno`'), ' ',
                Sequelize.col('`Usuario`.`Nombres`')
            ), 'asignado'],
                [Sequelize.fn('DATE_FORMAT', Sequelize.col('FechaSolicitud'), '%d/%m/%Y'), 'fecha_solicitud'],
            ],
            include: [
                {
                    model: Almacen,
                    attributes: [],
                    required: true
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
                }
            ],
            where: {
              IdEmpresa: IdEmpresa,
              IdAlmacenOrigen: {
                [Sequelize.Op.in]: IdAlmacenes
              },
              IdEstado
            }
          })
          .then(solicitudes => solicitudes.map(solicitud => {
            if (!solicitud.only_asignado) solicitud.asignado = 'VARIOS'
            return solicitud
        }))
    }

    static findById = async (IdSolicitud, tipo = 'SOLTRAN') => {
        return SolicitudTransferencia.findByPk(IdSolicitud, {
            attributes: [
                ['IdSolicitud', 'id'],
                ['MotivoSolicitud', 'motivo'],
                [Sequelize.fn('DATE_FORMAT', Sequelize.col('FechaPropuesta'), '%d/%m/%Y'), 'fecha'],
                [Sequelize.fn('TIME_FORMAT', Sequelize.col('FechaPropuesta'), '%H:%i'), 'hora'],
                [Sequelize.fn('CONCAT', `${tipo}-`,
                    Sequelize.col('Periodo'), '-',
                    Sequelize.fn('LPAD', Sequelize.col('Correlativo'), 6, '0')),
                    'codigo'
                ],
                [Sequelize.col('`DetalleSolicitudTransferencia->UsuarioNegocio->Usuario`.`Nombres`'), 'asignado'],
                [Sequelize.col('`DetalleSolicitudTransferencia->UsuarioNegocio->Usuario`.`NroDocumento`'), 'num_doc'],
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
            console.dir('CONSULTA 1');
            return sequelize.query(LISTAR_SOLICITUDES_POR_TRANSFERENCIA_IDS, {
                replacements: { ids: solicitudes, IdEmpresa, IdAlmacenes },
                type: QueryTypes.SELECT
            })
        }
        console.dir('CONSULTA 2');
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
                [Sequelize.col('`SolicitudTransferencia->Usuario`.`IdUsuario`'), 'id_asignado'],
                [Sequelize.col('`SolicitudTransferencia->Usuario`.`Nombres`'), 'asignado'],
                [Sequelize.col('`SolicitudTransferencia->Usuario`.`NroDocumento`'), 'num_doc'],
                [Sequelize.col('Parametro.Nombre'), 'estado'],
                [Sequelize.col('Parametro.Valor1'), 'color'],
                [Sequelize.fn('IF',
                    Sequelize.literal('COUNT(distinct `DetalleSolicitudTransferencia->TipoNegocio`.`IdNegocio`) > 1'),
                    [0, 1]),
                    'only_cuenta'
                ],
                [Sequelize.col('`DetalleSolicitudTransferencia->TipoNegocio`.`Nombre`'), 'cuenta'],
                [Sequelize.col('`DetalleSolicitudTransferencia->Almacenes`.`IdAlmacen`'), 'id_almacen'],
                [Sequelize.col('`DetalleSolicitudTransferencia->Almacenes`.`Nombre`'), 'almacen'],
                [Sequelize.fn('IFNULL', Sequelize.col('`DespachoSolicituds.Observacion`'), ''), 'comentario']
            ],
            include: [
                {
                    model: Parametro,
                    attributes: [],
                    required: true
                },
                {
                    model: DetalleSolicitudTransferencia,
                    attributes: [],
                    required: true,
                    where: {
                        IdAlmacen: {[Op.in]: IdAlmacenes}
                    },
                    include: [
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
        return SolicitudTransferencia.update(data.params, {
            where: {
                IdSolicitud: data.id
            },
            transaction
        })
    }


    static listarEstados = async (Tipo, IdEmpresa, IdAlmacenes) => {
        return SolicitudTransferencia.findAll({
            attributes: [
                [Sequelize.fn('COUNT', Sequelize.literal('DISTINCT SolicitudTransferencia.IdSolicitud')), 'cantidad'],
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
                    model: DetalleSolicitudTransferencia,
                    attributes: [],
                    required: true,
                    // where: {
                    //     IdAlmacen: { [Op.in]: IdAlmacenes }
                    // }
                }
            ],
            where: {
                Tipo,
                IdEmpresa,
                IdEstado: {[Op.notIn]: [
                    '217aeef5-2957-4a87-bfa8-8a6e65ed0737'
                ]},
                IdAlmacenOrigen: {
                    [Sequelize.Op.in]: IdAlmacenes
                }
            },
            group: ['SolicitudTransferencia.IdEstado']
        })
    }


    static rechazarSolicitudTransferencia = async (idSolicitud) => {
        const t = await sequelize.transaction();
       
        try{
            let arrayDetalles = [];
            const idDetalles =  await sequelize.query(LISTAR_ID_DET_SOLICITUD_POR_TRANSFERENCIA_IDS, {
                replacements: {id: idSolicitud },
                type: QueryTypes.SELECT
            });
         
            for(const item of idDetalles){
                arrayDetalles.push(item.IdDetalleSolicitud);
            }   

            await EstadoDetalle.destroy({ where:{ IdDetalleSolicitudTransferencia: {
                [Sequelize.Op.in]: arrayDetalles
            } }, transaction: t });
            await Estado.destroy({ where:{ IdTransferencia: idSolicitud }, transaction: t });
            await DetalleSolicitudTransferencia.destroy({ where:{ IdSolicitud: idSolicitud }, transaction: t });
            await SolicitudTransferencia.destroy({ where:{ IdSolicitud: idSolicitud }, transaction: t });
  
            await t.commit();
            return true;
        }catch(error){
            console.error(error);
            await t.rollback();
            return false;
        }
    }

    static aprobarPendienteAprobacion = async (idSolicitud,idEstadoProgramar, username) => {
        const t = await sequelize.transaction();
       
        try{

            const solicitudTransferencia =  await SolicitudTransferencia.findOne({
                where:{
                    IdSolicitud: idSolicitud
                }
            });

            if(solicitudTransferencia != null){
                let arrayDetalles = [];
                const idDetalles =  await sequelize.query(LISTAR_ID_DET_SOLICITUD_POR_TRANSFERENCIA_IDS, {
                    replacements: {id: idSolicitud },
                    type: QueryTypes.SELECT
                });
            
                for(const item of idDetalles){
                    arrayDetalles.push(item.IdDetalleSolicitud);
                }   


                const [numFilasActualizadas , filasActualizadas] = await SolicitudTransferencia.update(
                    {  IdEstado: idEstadoProgramar } ,
                    {
                        where:{
                            IdSolicitud: idSolicitud
                        },
                        returning: true , transaction: t
                    }
                );

                if(filasActualizadas > 0){
  
                    await Estado.create({
                        Tipo: 'PEDIDO',
                        UsuarioCreacion: username,
                        IdSocilitud: null,
                        IdParametro: idEstadoProgramar,
                        IdTransferencia: idSolicitud
                    } , { transaction: t});


                    await DetalleSolicitudTransferencia.update(
                        {  IdEstado: idEstadoProgramar } ,
                        {
                            where:{
                                IdSolicitud: idSolicitud
                            },
                            returning: true , transaction: t
                        }
                    );

                    if(arrayDetalles.length > 0){
                        for(const item of arrayDetalles){

                            await EstadoDetalle.create({
                                UsuarioCreacion: username,
                                IdDetalleSolicitud: null,
                                IdParametro: idEstadoProgramar,
                                IdDetalleSolicitudTransferencia: item
                            } , { transaction: t});
                        }   
                        await t.commit();
              
                        return true;
                    }
              
                } 
            }
            await t.rollback();
        }catch(error){
            console.error(error);
            await t.rollback();
        }
        return false;
    }
}

export default SolicitudTransferenciaRepository
