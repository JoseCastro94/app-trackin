import { ArticuloNegocio } from '../models/ArticuloNegocio.js'

//const usuario_activo = "45631343"

export const createArticuloNegocio = async (req, res) => {
    const { user } = req.headers
    const usuario_activo = user.username

    const {
        name,
        description,
        type
    } = req.body

    try {
        let newArticuloNegocio = await ArticuloNegocio.create(
            {
                Nombre: name,
                Descripcion: description,
                Tipo: type,
                UsuarioCreacion: usuario_activo,
                UsuarioModifica: usuario_activo
            }
        )
        return res.json(newArticuloNegocio)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message,
        })
    }
    res.json("bussnes article created")
}

export const getArticuloNegocios = async (req, res) => {
    try {
        const articulo_negocio = await ArticuloNegocio.findAll({
            attributes: ["IdAlmacen", "Nombre", "Descripcion", "Activo", "Tipo"],
        })
        res.json(articulo_negocio)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}