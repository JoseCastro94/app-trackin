import { UsuarioEmpresa } from "../models/UsuarioEmpresa.js"

export const updUsuarioEmpresa = async (req, res) => {
    const { user, company } = req.headers
    const usuario_activo = user.username
    const id_usuario_activo = user.id_user
    const id_empresa_activo = company.id

    const {
        IdUsuario,
        listEmpresa = []
    } = req.body

    let resultado = {
        status: 'Ok',
        message: 'Se insertó la solicitud correctamente'
    }

    const newRegisters = listEmpresa
        .map(element => {
            return {
                UsuarioCreacion: usuario_activo,
                UsuarioModifica: usuario_activo,
                IdUsuario: IdUsuario,
                IdEmpresa: element
            }
        })

    try {
        await UsuarioEmpresa
            .destroy({
                where: {
                    IdUsuario: IdUsuario
                }
            })

        await UsuarioEmpresa
            .bulkCreate(newRegisters)

        res.json(resultado)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}