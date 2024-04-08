export const LISTAR_POR_ID_SOLICITUD = `select distinct u.IdUsuario as id,
                                        CONCAT(u.ApellidoPaterno, ' ', u.ApellidoMaterno, ' ', u.Nombres) as nombre,
                                        u.NroDocumento as num_doc
                                        from DetalleSolicitudArticulos as dsa
                                        inner join Usuarios as u on u.IdUsuario = dsa.IdUsuario
                                        where dsa.IdSocilitud = :id_solicitud`
