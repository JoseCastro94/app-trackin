export const LISTAR_DESPACHO_SOLICITUD = `
    select ds.IdDespacho as id, 
           ds.Codigo as codigo_despacho,
           CONCAT(IF(ds.Tipo = 'DEVOLUCION', 'DEV-','SOL-'),sa.Periodo, '-',LPAD(sa.Correlativo, 6, '0')) as codigo_solicitud,
           date_format(ds.FechaProgramada, '%d/%m/%Y') as fecha, 
           time_format(ds.FechaProgramada,  '%h:%i %p') as hora,
           p.Nombre as estado, 
           p.Valor1 as color, 
           dsa.IdSocilitud as id_solicitud,
           u.NroDocumento as documento,
           u.Correo as email_asignado,
           CONCAT(u.ApellidoPaterno, ' ', u.ApellidoMaterno, ' ', u.Nombres) as asignado,
           IF(count(distinct dsa.IdNegocio) > 1, 'VARIOS', tn.Nombre) as cuenta, 
           a.Nombre as almacen, 
           ds.Observacion as comentario,
           ds.IdGuia
    from DespachoSolicituds as ds
             inner join SolicitudArticulos as sa on sa.IdSocilitud = ds.IdSocilitud and sa.IdEmpresa = ds.IdEmpresa
             inner join DetalleDespachoSolicituds as dds on ds.IdDespacho = dds.IdDespacho
             inner join Parametros as p on p.IdParametro = ds.IdEstado
             inner join DetalleSolicitudArticulos as dsa on dsa.IdDetalleSocilitud = dds.IdDetalleSolicitud
             inner join Usuarios as u on u.IdUsuario = ds.IdAsignado
             inner join TipoNegocios as tn on tn.IdNegocio = dsa.IdNegocio and tn.IdEmpresa = ds.IdEmpresa
             inner join Almacenes as a on ds.IdAlmacen = a.IdAlmacen and a.IdEmpresa = ds.IdEmpresa
    where #ds.IdEstado != '75cf2544-a507-4ff1-b7b1-174a1e158dd0' and 
    ds.Tipo = :tipo
    and ds.IdEmpresa = :IdEmpresa
    and ds.IdAlmacen in (:IdAlmacenes)
    and (NULLIF(:_estado, '') IS NULL OR ds.IdEstado = :_estado)
    and (ds.Codigo like CONCAT('%', :filtro, '%') 
        or u.NroDocumento like CONCAT('%', :filtro, '%') 
        or CONCAT(u.ApellidoPaterno, ' ', u.ApellidoMaterno, ' ', u.Nombres) like CONCAT('%', :filtro, '%') 
        or CONCAT(IF(ds.Tipo = 'DEVOLUCION', 'DEV-','SOL-'),sa.Periodo, '-',LPAD(sa.Correlativo, 6, '0')) like CONCAT('%', :filtro, '%')
        )
    and (DATE(ds.FechaProgramada) between :fechaIni and :fechaFin)
    group by ds.IdDespacho
    order by ds.FechaProgramada desc;
`

export const LISTAR_CANTIDAD_ENTREGADO = `
    select IFNULL(SUM(dds.CantidadEntrega), 0) as cantidad_entregada, dsa.Cantidad as cantidad_solicitada
    from DespachoSolicituds as ds
    inner join SolicitudArticulos as sa
    on sa.IdSocilitud = ds.IdSocilitud
    inner join DetalleSolicitudArticulos dsa
    on sa.IdSocilitud = dsa.IdSocilitud
    left join DetalleDespachoSolicituds as dds
    on dds.IdDetalleSolicitud = dsa.IdDetalleSocilitud
    and dds.IdEstadoEntrega is not null
    where ds.IdDespacho = :id_despacho
    group by dsa.IdDetalleSocilitud
    having cantidad_entregada != cantidad_solicitada;
`
