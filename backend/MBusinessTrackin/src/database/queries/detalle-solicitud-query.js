export const LISTAR_DETALLE_POR_ID_SOLICITUD = `
    select dsa.IdDetalleSocilitud as id, dsa.ItemName as item, a.ItemCode as codigo
           , u.NroDocumento as documento, CONCAT(u.ApellidoPaterno, ' ', u.ApellidoMaterno, ' ', u.Nombres) as asignado,
           tn.Nombre as cuenta, dsa.Cantidad as cantidad, dsa.CantidadProgramada as cantidad_programada, p.Nombre as estado,
           IFNULL((
               select SUM(Cantidad) * -1
               from TransacAlmacens as ta
               where ta.IdDetalleSolicitud = dsa.IdDetalleSocilitud
                 and Tipo = 'ENTREGA'
                 and ta.IdArticulo = a.IdArticulo
                 and ta.IdNegocio = dsa.IdNegocio
                 and ta.IdAlmacenOrigen = al.IdAlmacen
               group by ta.IdDetalleSolicitud
           ), 0) as cantidad_entrega,
           getStock(IdDetalleSocilitud, a.IdArticulo, dsa.IdAlmacen, dsa.IdNegocio, 'COMPROMETIDO') as stock,
           0 as picking, al.Nombre as almacen, a.IdArticulo as id_articulo, dsa.IdAlmacen as id_almacen,
           dsa.IdNegocio as id_negocio,
           ga.TieneSerie as has_serie,
           ga.Nombre as categoria,
           ga.U_Devolucion as devolucion
    from DetalleSolicitudArticulos as dsa
    inner join ArticuloNegocios as an on dsa.IdArticuloNegocio = an.IdArticuloNegocio and an.IdNegocio = dsa.IdNegocio
    inner join Articulos as a on an.IdArticulo = a.IdArticulo
    inner join GrupoArticulos as ga on ga.IdGrupoArticulo = a.IdGrupoArticulo
    inner join TipoNegocios as tn on dsa.IdNegocio = tn.IdNegocio
    inner join Almacenes as al on al.IdAlmacen = dsa.IdAlmacen
    inner join Parametros as p on p.IdParametro = dsa.IdEstado and p.Activo = 1
    inner join Usuarios as u on u.IdUsuario = dsa.IdUsuario
    where dsa.IdSocilitud = :id_solicitud and tn.IdEmpresa = :IdEmpresa and dsa.IdAlmacen in (:IdAlmacenes)
    order by dsa.ItemName;
`
