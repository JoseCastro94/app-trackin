export const LISTAR_ID_DET_SOLICITUD_POR_TRANSFERENCIA_IDS = `	
select IdDetalleSolicitud  from DetalleSolicitudTransferencia dst where IdSolicitud = :id
`