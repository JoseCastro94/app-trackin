export const LISTAR_POR_ID_SOLICITUD_TRANSFERENCIA = `select distinct u.IdUsuario as id,
CONCAT(u.ApellidoPaterno, ' ', u.ApellidoMaterno, ' ', u.Nombres) as nombre,
u.NroDocumento as num_doc
from SolicitudTransferencia   as st
inner join Usuarios as u on u.IdUsuario = st.IdUsuarioDestino 
where st.IdSolicitud  = :id_solicitud`
