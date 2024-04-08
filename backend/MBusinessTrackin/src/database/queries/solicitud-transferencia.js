export const LISTAR_SOLICITUDES_POR_TRANSFERENCIA_IDS = `	
select st.IdSolicitud AS id, 
st.MotivoSolicitud AS motivo_solicitud,
p.Nombre AS estado, 
p.Valor1 AS color, 
DATE_FORMAT(FechaSolicitud, '%d/%m/%Y') AS fecha_solicitud,
FALSE AS picking,
CONCAT(u.ApellidoPaterno, ' ', u.ApellidoMaterno, ' ', u.Nombres) AS asignado,
CONCAT('SOLTRAN-', Periodo, '-', LPAD(Correlativo, 6, '0')) AS codigo,
a.Nombre AS almacen_solicitante

FROM 
SolicitudTransferencia AS st
INNER JOIN 
DetalleSolicitudTransferencia as dst ON st.IdSolicitud  = dst.IdSolicitud
INNER JOIN 
Usuarios AS u ON u.IdUsuario = st.IdUsuarioDestino 
INNER JOIN 
Parametros AS p ON p.IdParametro = st.IdEstado
INNER JOIN 
TipoNegocios AS tn ON tn.IdNegocio = dst.IdNegocio
INNER JOIN
Almacenes AS a ON a.IdAlmacen = st.IdAlmacenDestino 
WHERE 
st.IdSolicitud IN (:ids) 
AND st.IdEmpresa = :IdEmpresa 
AND dst.IdAlmacen IN (:IdAlmacenes)
GROUP BY 
st.IdSolicitud;`