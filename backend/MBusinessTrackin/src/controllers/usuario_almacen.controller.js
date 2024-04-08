import { UsuarioAlmacen } from '../models/UsuarioAlmacen.js'
import { Usuario } from '../models/Usuario.js'
import { Almacen } from '../models/Almacen.js'

//const usuario_activo = "45631343"

export const createUsuarioAlmacen = async (req, res) => {
    const { user } = req.headers
    const usuario_activo = user.username

    const {
        IdUsuario,
        IdAlmacen,
        observation,
        charger
    } = req.body

    try {
        let newUsuarioAlmacen = await UsuarioAlmacen.create(
            {
                IdAlmacen: IdAlmacen,
                IdUsuario: IdUsuario,
                Observacion: observation,
                CargoRelevo: charger,
                UsuarioCreacion: usuario_activo,
                UsuarioModifica: usuario_activo
            }
        )
        return res.json(newUsuarioAlmacen)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message,
        })
    }
    res.json("warehouse user created")
}

export const getUsuarioAlmacenes = async (req, res) => {
    try {
        const usuarioalmacenes = await UsuarioAlmacen.findAll({
            attributes: [
                "IdUsuarioAlmacen",
                "IdAlmacen",
                "IdUsuario",
                "Observacion",
                "CargoRelevo"
            ],
        })
        res.json(usuarioalmacenes)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const updUsuarioAlmacen = async (req, res) => {
    const { user, company } = req.headers
    const usuario_activo = user.username
    const id_usuario_activo = user.id_user
    const id_empresa_activo = company.id

    const {
        IdUsuario,
        listAlmacen = []
    } = req.body

    let resultado = {
        status: 'Ok',
        message: 'Se insertó la solicitud correctamente'
    }

    const newRegisters = listAlmacen
        .map(element => {
            return {
                UsuarioCreacion: usuario_activo,
                UsuarioModifica: usuario_activo,
                IdUsuario: IdUsuario,
                IdAlmacen: element
            }
        })

    try {
        await UsuarioAlmacen
            .destroy({
                where: {
                    IdUsuario: IdUsuario,
                    IsAdmin: false
                }
            })

        await UsuarioAlmacen
            .bulkCreate(newRegisters)

        res.json(resultado)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}