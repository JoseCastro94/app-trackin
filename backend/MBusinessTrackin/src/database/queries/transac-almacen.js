export const BUSCAR_CANTIDAD = `SELECT getQuantityTransacAlmacen(:idDetalleSolicitud, :idArticulo, :tipo) as cantidad`
export const BUSCAR_STOCK = `SELECT getStock(:idDetalleSolicitud, :idArticulo, :idAlmacen, :idNegocio, :tipo) as stock`