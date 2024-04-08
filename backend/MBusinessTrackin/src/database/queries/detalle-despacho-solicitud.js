export const LISTAR_DETALLE_DESPACHO_SOLICITUD = `
    select dda.ItemCode as codigo_producto, dda.ItemName as nombre_producto,
           dda.CantidadPicking as cantidad_picking,
           dsa.Cantidad as cantidad_solicitada,
           dda.CantidadEntrega as cantidad_entregada,
           0 as entrega,
           p.Nombre as estado,
           p.Valor1 as color,
           tn.Nombre as cuenta,
           dda.IdDetalleDespacho as id_detalle_despacho,
           a.Nombre as almacen,
           dsa.IdDetalleSocilitud as id_detalle_solicitud,
           dsa.IdAlmacen as id_almacen,
           dsa.IdNegocio as id_negocio,
           an.IdArticulo as id_articulo,
           ga.TieneSerie as has_serie,
           ga.Nombre as categoria,
           ga.U_Devolucion as devolucion,
           IFNULL(dda.SerialNumber, '') as serie,
           dda.IdEstadoEntrega as estado_entrega
    from DetalleDespachoSolicituds as dda
        inner join DetalleSolicitudArticulos as dsa on dda.IdDetalleSolicitud = dsa.IdDetalleSocilitud
        inner join TipoNegocios as tn on dsa.IdNegocio = tn.IdNegocio
        inner join Parametros as p on p.IdParametro = dda.IdEstadoEntrega
        inner join Almacenes as a on a.IdAlmacen = dsa.IdAlmacen and a.IdEmpresa = tn.IdEmpresa
        inner join ArticuloNegocios as an
            on an.IdArticuloNegocio = dsa.IdArticuloNegocio and tn.IdNegocio = an.IdNegocio
        inner join Articulos as ar on ar.IdArticulo = an.IdArticulo
        inner join GrupoArticulos as ga on ga.IdGrupoArticulo = ar.IdGrupoArticulo
    where dda.IdDespacho = :id_despacho
    order by dda.ItemName
`
