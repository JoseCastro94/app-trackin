export const LISTAR_ALMACENES_POR_ID_USUARIO = `select a.IdAlmacen as id, a.Nombre as nombre
                                                from UsuarioAlmacenes as ua
                                                inner join Almacenes as a
                                                on ua.IdAlmacen = a.IdAlmacen
                                                where ua.IdUsuario = :id_usuario
                                                and a.Activo = 1`