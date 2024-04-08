export const OBTENER_SERIES_ARTICULO = `select
cs.IdControlSerie, cs.SerialNumber, a.ItemName 
FROM 
DetalleSolicitudTransferencia dst
inner join Articulos a on a.ItemCode = dst.ItemCode 
inner join ControlSeries cs on a.IdArticulo = cs.IdArticulo 
where cs.IdArticulo = :idarticulo and cs.IdEmpresa = :idempresa
and cs.IdAlmacen IN (:idalmacen) and cs.IdNegocio = :idnegocio
and dst.IdSolicitud = :idsolicitud`