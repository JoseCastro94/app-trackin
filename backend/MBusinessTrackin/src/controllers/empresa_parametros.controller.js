import Sequelize from "sequelize"
import { EmpresaParametro } from '../models/EmpresaParametro.js'
import { UsuarioEmpresa } from '../models/UsuarioEmpresa.js'

//const usuario_activo = "45631343"

export const createEmpresaParametro = async (req, res) => {
    const { user } = req.headers
    const usuario_activo = user.username

    const {
        ruc,
        socialreason,
        comercialname
    } = req.body

    try {
        let newEmpresaParametro = await EmpresaParametro.create(
            {
                Ruc: ruc,
                RazonSocial: socialreason,
                NombreComercial: comercialname,
                UsuarioCreacion: usuario_activo,
                UsuarioModifica: usuario_activo
            }
        )
        return res.json(newEmpresaParametro)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message,
        })
    }
    res.json("warehouse created")
}

export const getEmpresaParametros = async (req, res) => {
    try {
        const empresas = await EmpresaParametro.findAll({
            attributes: ["IdEmpresa", "Ruc", "RazonSocial", "NombreComercial", "UsuarioCreacion", "FechaCreacion"],
        })
        res.json(empresas)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const getMyEmpresa = async (req, res) => {
    try {
        const { company } = req.headers
        const id_empresa_activo = company.id

        const empresas = await EmpresaParametro.findOne({
            attributes: [
                "Ruc",
            ],
            where: {
                IdEmpresa: id_empresa_activo,
            }
        })
        res.json(empresas)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const getUsuarioEmpresa = async (req, res) => {
    const { user, company } = req.headers
    const id_usuario_activo = user.id_user
    const usuario_activo = user.username
    const id_empresa_activo = company.id

    const {
        IdUsuario
    } = req.body

    try {
        const empresas = await EmpresaParametro.findAll({
            attributes: [
                ["IdEmpresa", "id"],
                "Ruc",
                "RazonSocial",
            ],
            where: {
                //IdEmpresa: id_empresa_activo,
                Activo: true
            },
            include: {
                model: UsuarioEmpresa,
                attributes: ["IdUsuarioEmpresa"],
                where: {
                    IdUsuario: IdUsuario,
                },
                required: false
            },
            order: [
                [Sequelize.col('UsuarioEmpresas.IdUsuarioEmpresa'), 'DESC'],
                ["RazonSocial", "ASC"],
            ],
        })

        const select = empresas
            .filter(element => element.UsuarioEmpresas.length > 0)
            .map(element => element.toJSON().id)

        res.status(200).json({
            empresas: empresas,
            select: select
        })
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}