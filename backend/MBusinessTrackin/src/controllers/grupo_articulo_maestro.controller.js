import { GrupoArticuloMaestro } from '../models/GrupoArticuloMaestro.js'

export const getGrupoArticuloMaestros = async (req, res) => {
    try {
        const grupo_articulo = await GrupoArticuloMaestro.findAll({
            attributes: ["IdAlmacen", "Nombre", "Descripcion", "Activo", "Tipo"],
        })
        res.json(grupo_articulo)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}