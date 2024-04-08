import { GrupoArticulo } from '../models/GrupoArticulo.js'

//const usuario_activo = "45631343"

export const createGrupoArticulo = async (req, res) => {
    const { user } = req.headers
    const usuario_activo = user.username

    const {
        name,
        description,
        type
    } = req.body

    try {
        let newGrupoArticulo = await GrupoArticulo.create(
            {
                Nombre: name,
                Descripcion: description,
                Tipo: type,
                UsuarioCreacion: usuario_activo,
                UsuarioModifica: usuario_activo
            }
        )
        return res.json(newGrupoArticulo)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message,
        })
    }
    res.json("article group created")
}

export const getGrupoArticulos = async (req, res) => {
    try {
        const grupo_articulo = await GrupoArticulo.findAll({
            attributes: ["IdAlmacen", "Nombre", "Descripcion", "Activo", "Tipo"],
        })
        res.json(grupo_articulo)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}