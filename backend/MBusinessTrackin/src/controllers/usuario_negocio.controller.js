import { UsuarioNegocio } from '../models/UsuarioNegocio.js'
import { TipoNegocio } from '../models/TipoNegocio.js'

//const usuario_activo = "45631343"

export const createUsuarioNegocio = async (req, res) => {
    const { user } = req.headers
    const usuario_activo = user.username

    const {
        name,
        description,
        type
    } = req.body

    try {
        let newUsuarioNegocio = await UsuarioNegocio.create(
            {
                Nombre: name,
                Descripcion: description,
                Tipo: type,
                UsuarioCreacion: usuario_activo,
                UsuarioModifica: usuario_activo
            }
        )
        return res.json(newUsuarioNegocio)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message,
        })
    }
    res.json("user busness created")
}

export const getUsuarioNegocios = async (req, res) => {
    try {
        const usuario_negocios = await UsuarioNegocio.findAll({
            attributes: ["IdAlmacen", "Nombre", "Descripcion", "Activo", "Tipo"],
        })
        res.json(usuario_negocios)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const updUsuarioNegocio = async (req, res) => {
    const { user, company } = req.headers
    const usuario_activo = user.username
    const id_usuario_activo = user.id_user
    const id_empresa_activo = company.id

    const {
        IdUsuario,
        listNegocio = []
    } = req.body

    let resultado = {
        status: 'Ok',
        message: 'Se insertó la solicitud correctamente'
    }

    const newRegisters = listNegocio
        .map(element => {
            return {
                UsuarioCreacion: usuario_activo,
                UsuarioModifica: usuario_activo,
                IdUsuario: IdUsuario,
                IdNegocio: element
            }
        })

    try {
        await UsuarioNegocio
            .destroy({
                where: {
                    IdUsuario: IdUsuario
                }
            })

        await UsuarioNegocio
            .bulkCreate(newRegisters)

        res.json(resultado)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}