export const LISTAR_SOLICITUDES_POR_IDS = `select sa.IdSocilitud as id, MotivoSolicitud as motivo_solicitud,
                                                  p.Nombre as estado, p.Valor1 as color, date_format(FechaSolicitud, '%d/%m/%Y') as fecha_solicitud,
                                                  false as picking,
                                                  IF(count(distinct dsa.IdUsuario) > 1, 'VARIOS', CONCAT(u.ApellidoPaterno, ' ', u.ApellidoMaterno, ' ', u.Nombres)) as asignado,
                                                  IF(count(distinct dsa.IdUsuario) > 1, 'VARIOS', u.IdUsuario) as id_asignado,
                                                  CONCAT('SOL-',Periodo, '-',LPAD(Correlativo, 6, '0')) as codigo,
                                                  IF(count(distinct dsa.IdNegocio) > 1, 'VARIOS', tn.Nombre) as cuenta,
                                                  count(distinct dsa.IdNegocio) as count_cuentas,
                                                  count(distinct dsa.IdUsuario) as count_asignados,
                                                  IFNULL(ds.Observacion, '') as comentario
                                           from SolicitudArticulos as sa
                                                    inner join DetalleSolicitudArticulos dsa on sa.IdSocilitud = dsa.IdSocilitud
                                                    inner join Usuarios as u on u.IdUsuario = dsa.IdUsuario
                                                    inner join Parametros as p on p.IdParametro = sa.IdEstado
                                                    inner join TipoNegocios as tn on tn.IdNegocio = dsa.IdNegocio
                                                    left join DespachoSolicituds ds on ds.IdSocilitud = sa.IdSocilitud
                                           where sa.IdSocilitud in (:ids) and sa.IdEmpresa = :IdEmpresa and dsa.IdAlmacen in (:IdAlmacenes)
                                           group by sa.IdSocilitud;`