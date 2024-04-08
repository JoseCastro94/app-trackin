import { GrupoTrabajador } from '../models/GrupoTrabajador.js'
import { Usuario } from '../models/Usuario.js'
import { EmpresaParametro } from '../models/EmpresaParametro.js'
import { UsuarioNegocio } from '../models/UsuarioNegocio.js'
import { TipoNegocio } from '../models/TipoNegocio.js'
import Sequelize, { Op } from "sequelize"

//const id_usuario_activo = "36f440fa-7a19-4da7-999e-b5a95789df94"

export const getGrupoTrabajador = async (req, res) => {
    const { user, company } = req.headers
    const id_usuario_activo = user.id_user
    const id_empresa_activo = company.id

    try {
        const grupo = await GrupoTrabajador.findAll({
            attributes: [
                [Sequelize.col('Usuario.IdUsuario'), "id"],
                [Sequelize.col('Usuario.Nombres'), "Nombres"],
                [Sequelize.col('Usuario.ApellidoPaterno'), "ApellidoPaterno"],
                [Sequelize.col('Usuario.ApellidoMaterno'), "ApellidoMaterno"],
                [Sequelize.col('Usuario.NroDocumento'), "NroDocumento"],
                [Sequelize.col('Usuario.TipoDocumento'), "TipoDocumento"],
            ],
            include: {
                model: Usuario,
                attributes: [],
                required: true,
                where: {
                    IdEmpresa: id_empresa_activo
                }
            },
            where: {
                IdUsuarioNivel: id_usuario_activo,
                Activo: true
            },
            order: [[Sequelize.col('Usuario.NroDocumento'), 'ASC']],
        })
        res.json(grupo)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const getGrupoTrabajadorFull = async (req, res) => {
    const { user, company } = req.headers
    const id_usuario_activo = user.id_user
    const id_empresa_activo = company.id

    try {
        const {
            filter
        } = req.body

        let where = {
            IdEmpresa: id_empresa_activo
        }

        if (filter && filter !== '') {
            const f = `%${String(filter).replace(new RegExp(' ', 'g'), '%')}%`

            console.log(f)

            where[Op.or] = [{
                NroDocumento: {
                    [Op.like]: f
                }
            }, Sequelize.where(Sequelize.fn(
                'concat',
                Sequelize.col('ApellidoPaterno'),
                Sequelize.col('ApellidoMaterno'),
                Sequelize.col('Nombres')),
                {
                    [Op.like]: f
                }
            )]
        }

        const grupo = await GrupoTrabajador.findAll({
            attributes: [
                [Sequelize.col('Usuario.IdUsuario'), "id"],
                [Sequelize.col('Usuario.Nombres'), "Nombres"],
                [Sequelize.col('Usuario.ApellidoPaterno'), "ApellidoPaterno"],
                [Sequelize.col('Usuario.ApellidoMaterno'), "ApellidoMaterno"],
                [Sequelize.col('Usuario.NroDocumento'), "NroDocumento"],
                [Sequelize.col('Usuario.TipoDocumento'), "TipoDocumento"],
                [Sequelize.col('Usuario.Activo'), "Activo"],
                [Sequelize.col('Usuario.EmpresaParametro.RazonSocial'), "RazonSocial"],
            ],
            include: {
                model: Usuario,
                where,
                include: [
                    {
                        model: EmpresaParametro
                    }
                ]
            },
            where: {
                IdUsuarioNivel: id_usuario_activo,
                Activo: true
            },
            order: [[Sequelize.col('Usuario.NroDocumento'), 'ASC']],
        })

        const my = await Usuario.findOne({
            attributes: [
                ["IdUsuario", "id"],
                ["Nombres", "Nombres"],
                ["ApellidoPaterno", "ApellidoPaterno"],
                ["ApellidoMaterno", "ApellidoMaterno"],
                ["NroDocumento", "NroDocumento"],
                ["TipoDocumento", "TipoDocumento"],
                ["Activo", "Activo"],
                [Sequelize.col('EmpresaParametro.RazonSocial'), "RazonSocial"],
            ],
            include: {
                model: EmpresaParametro,
                attributes: [],
            },
            where: {
                IdEmpresa: id_empresa_activo,
                IdUsuario: id_usuario_activo
            }
        })
        if (my) {
            grupo.unshift(my)
        }
        res.json(grupo)
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: e.message });
    }
}

export const updGrupoTrabajador = async (req, res) => {
    const { user, company } = req.headers
    const usuario_activo = user.username
    const id_usuario_activo = user.id_user
    const id_empresa_activo = company.id

    const {
        IdUsuarioNivel,
        listUser = []
    } = req.body

    let resultado = {
        status: 'Ok',
        message: 'Se insertó la solicitud correctamente'
    }

    const newRegisters = listUser.map(element => {
        return {
            Observacion: 'Insertado desde el mantenimmiento',
            UsuarioCreacion: usuario_activo,
            UsuarioModifica: usuario_activo,
            IdUsuarioNivel: IdUsuarioNivel,
            IdUsuarioSubNivel: element
        }
    })

    try {
        await GrupoTrabajador.destroy({
            where: {
                IdUsuarioNivel: IdUsuarioNivel
            }
        })

        await GrupoTrabajador
            .bulkCreate(newRegisters)

        res.json(resultado)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}