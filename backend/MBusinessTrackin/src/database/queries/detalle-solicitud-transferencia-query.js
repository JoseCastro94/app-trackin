export const LISTAR_DETALLE_POR_ID_SOLICITUD_TRANSFERENCIA = `
        select 
        dst.IdDetalleSolicitud as id,
        dst.ItemName as item,
        dst.ItemCode as codigo,
        a.Nombre as almacen_asignado,
        CONCAT(u.ApellidoPaterno, ' ', u.ApellidoMaterno, ' ', u.Nombres) as usuario_asignado,
        tn.Nombre as negocio,
        dst.Cantidad as cantidad,
        '0' as stock,
        dst.IdNegocio,
        tn.IdEmpresa,
        an.IdArticulo as idarticulo
        from DetalleSolicitudTransferencia dst 
        inner join Almacenes a on a.IdAlmacen = dst.IdAlmacen
        inner join UsuarioAlmacenes ua on a.IdAlmacen = ua.IdAlmacen 
        inner join Usuarios u on u.IdUsuario = ua.IdUsuario 
        inner join TipoNegocios tn on tn.IdNegocio = dst.IdNegocio 
        inner join ArticuloNegocios an on an.IdArticuloNegocio = dst.IdArticuloNegocio
        where dst.IdSolicitud  = :id_solicitud  and tn.IdEmpresa = :IdEmpresa 
        GROUP by dst.IdDetalleSolicitud 
        `


