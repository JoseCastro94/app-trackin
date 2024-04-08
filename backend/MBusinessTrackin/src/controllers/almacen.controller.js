import { Almacen } from '../models/Almacen.js'
import { UsuarioAlmacen } from '../models/UsuarioAlmacen.js'
import { Usuario } from '../models/Usuario.js'
import Sequelize, { Op } from "sequelize"

//const usuario_activo = "45631343"
//const id_usuario_activo = "36f440fa-7a19-4da7-999e-b5a95789df94"

export const createAlmacen = async (req, res) => {
    const { user } = req.headers
    const usuario_activo = user.username

    const {
        name,
        description,
        type
    } = req.body

    try {
        let newAlmacen = await Almacen.create(
            {
                Nombre: name,
                Descripcion: description,
                Tipo: type,
                UsuarioCreacion: usuario_activo,
                UsuarioModifica: usuario_activo
            }
        )
        return res.json(newAlmacen)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message,
        })
    }
    res.json("warehouse created")
}

export const getAlmacenes = async (req, res) => {
    try {
        const almacenes = await Almacen.findAll({
            attributes: ["IdAlmacen", "Nombre", "Descripcion", "Activo", "Tipo"],
        })
        res.json(almacenes)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const getAlmacenEmpresa = async (req, res) => {
    const { company, user } = req.headers
    const id_empresa_activo = company.id
    const id_usuario_activo = user.id_user
    try {
        const almacenes = await Almacen.findAll({
            attributes: [
                ["IdAlmacen", "id"],
                ["Nombre", "nombre"]
            ],
            where: { 
                IdEmpresa: id_empresa_activo 
            },
            include: {
                model: UsuarioAlmacen,
                attributes: [],
                where: {
                    IdUsuario: id_usuario_activo
                }
            },
            order: [['Nombre', 'ASC']],
        })

        console.dir('ALAMACENES');
        console.dir(almacenes);
        res.json(almacenes)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const getOwnAlmacen = async (req, res) => {
    const { user, company } = req.headers
    const id_usuario_activo = user.id_user
    const id_empresa_activo = company.id

    try {
        const almacenes = await Almacen.findAll({
            attributes: [
                ["IdAlmacen", "id"],
                "Nombre",
                "Descripcion",
                "Tipo",
                [Sequelize.literal("'--Dirección--'"), "Direccion"],
                [Sequelize.col('UsuarioAlmacenes.Usuario.ApellidoPaterno'), "ApellidoPaterno"],
                [Sequelize.col('UsuarioAlmacenes.Usuario.ApellidoMaterno'), "ApellidoMaterno"],
                [Sequelize.col('UsuarioAlmacenes.Usuario.Nombres'), "Nombres"],
                [Sequelize.col('UsuarioAlmacenes.Usuario.NroDocumento'), "NroDocumento"],
            ],
            where: {
                IdEmpresa: id_empresa_activo,
                Activo: true,
            },
                include: {
                    model: UsuarioAlmacen,
                    include: {
                        model: Usuario,
                        attributes: [],
                    },
                    attributes: [],
                    where: {
                        IdUsuario: id_usuario_activo
                    }
                },
            order: [['Descripcion', 'ASC']],
        })
        res.json(almacenes)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const getNotOwnAlmacen = async (req, res) => {
    const { user, company } = req.headers
    const id_usuario_activo = user.id_user
    const id_empresa_activo = company.id

    const {
        id_almacen
    } = req.body

    try {
        const almacenes = await Almacen.findAll({
            attributes: [
                ["IdAlmacen", "id"],
                "Nombre",
                "Descripcion",
                "Tipo",
                [Sequelize.literal("'--Dirección--'"), "Direccion"],
                [Sequelize.col('UsuarioAlmacenes.Usuario.ApellidoPaterno'), "ApellidoPaterno"],
                [Sequelize.col('UsuarioAlmacenes.Usuario.ApellidoMaterno'), "ApellidoMaterno"],
                [Sequelize.col('UsuarioAlmacenes.Usuario.Nombres'), "Nombres"],
                [Sequelize.col('UsuarioAlmacenes.Usuario.NroDocumento'), "NroDocumento"],
            ],
            where: {
                IdEmpresa: id_empresa_activo,
                Activo: true,
                IdAlmacen: {
                    [Op.not]: id_almacen
                }
            },
            include: {
                model: UsuarioAlmacen,
                include: {
                    model: Usuario,
                    attributes: [],
                },
                attributes: [],
            },
            order: [['Descripcion', 'ASC']],
        })
        res.json(almacenes)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const getOwnJustAlmacen = async (req, res) => {
    const { user, company } = req.headers
    const id_usuario_activo = user.id_user
    const id_empresa_activo = company.id

    try {
        const almacenes = await Almacen.findAll({
            attributes: [
                "IdAlmacen",
                "Nombre",
                "Descripcion",
                "Tipo",
            ],
            where: {
                IdEmpresa: id_empresa_activo,
                Activo: true,
            },
            include: {
                model: UsuarioAlmacen,
                attributes: [],
                where: {
                    IdUsuario: id_usuario_activo,
                    IsAdmin: true
                }
            },
            order: [['Descripcion', 'ASC']],
        })
        res.json(almacenes)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const getAnyJustAlmacen = async (req, res) => {
    const { user, company } = req.headers
    const id_usuario_activo = user.id_user
    const id_empresa_activo = company.id

    try {
        const almacenes = await Almacen.findAll({
            attributes: [
                "IdAlmacen",
                "Nombre",
                "Descripcion",
                "Tipo",
            ],
            where: {
                IdEmpresa: id_empresa_activo,
                Activo: true,
            },
            order: [['Descripcion', 'ASC']],
        })
        res.json(almacenes)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const getUsuarioAlmacen = async (req, res) => {
    const { user, company } = req.headers
    const id_usuario_activo = user.id_user
    const usuario_activo = user.username
    const id_empresa_activo = company.id

    const {
        IdUsuario
    } = req.body

    try {
        const almacenes = await Almacen.findAll({
            attributes: [
                ["IdAlmacen", "id"],
                "Nombre",
                "Tipo",
            ],
            where: {
                IdEmpresa: id_empresa_activo,
                Activo: true
            },
            include: {
                model: UsuarioAlmacen,
                attributes: ["IdUsuarioAlmacen"],
                where: {
                    IdUsuario: IdUsuario,
                },
                required: false
            },
            order: [
                [Sequelize.col('UsuarioAlmacenes.IdUsuarioAlmacen'), 'DESC'],
                ["Tipo", "ASC"],
                ["Nombre", "ASC"],
            ],
        })

        const select = almacenes
            .filter(element => element.UsuarioAlmacenes.length > 0)
            .map(element => element.toJSON().id)

        res.status(200).json({
            almacenes: almacenes,
            select: select
        })
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}