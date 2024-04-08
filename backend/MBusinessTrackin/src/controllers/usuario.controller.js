import Sequelize, { Op } from "sequelize"
import { Usuario } from '../models/Usuario.js'
import { UsuarioAlmacen } from '../models/UsuarioAlmacen.js'
import { Almacen } from '../models/Almacen.js'
import { GrupoTrabajador } from '../models/GrupoTrabajador.js'
import UsuarioAlmacenRepository from "../repositories/UsuarioAlmacenRepository.js";

//const usuario_activo = "45631343"

export const createUsuario = async (req, res) => {
    const {
        password,
        midname,
        lastname,
        name,
        email,
        type_document,
        document
    } = req.body

    const { user } = req.headers
    const usuario_activo = user.username

    try {
        let newUsuario = await Usuario.create(
            {
                Clave: password,
                ApellidoPaterno: midname,
                ApellidoMaterno: lastname,
                Nombres: name,
                Correo: email,
                TipoDocumento: type_document,
                NroDocumento: document,
                UsuarioCreacion: usuario_activo,
                UsuarioModifica: usuario_activo
            }
        )
        return res.json(newUsuario)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message,
        })
    }
    res.json("user created")
}

export const getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: ["IdUsuario", "ApellidoPaterno", "ApellidoMaterno", "Nombres", "NroDocumento", "Correo"],
            include: {
                model: UsuarioAlmacen,
                include: Almacen
            }
        })
        res.json(usuarios)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const getUsuariosAlmacenEnabled = async (req, res) => {
    const { user, company } = req.headers
    const id_usuario_activo = user.id_user
    const id_empresa_activo = company.id

    try {
        const usuarios = await Usuario.findAll({
            attributes: [
                ["IdUsuario", "id"],
                "ApellidoPaterno",
                "ApellidoMaterno",
                "Nombres",
                "NroDocumento",
                "Correo"
            ],
            where: {
                Activo: true,
                EsResponsable: true,
                IdEmpresa: id_empresa_activo
            },
        })
        res.json(usuarios)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const getMyInfo = async (req, res) => {
    const { user, company } = req.headers
    const usuario_activo = user.username
    const id_empresa_activo = company.id

    try {
        const info = await Usuario.findOne({
            attributes: [
                "IdUsuario",
                "ApellidoPaterno",
                "ApellidoMaterno",
                "Nombres",
                "TipoDocumento",
                "NroDocumento"
            ],
            where: {
                NroDocumento: usuario_activo,
                IdEmpresa: id_empresa_activo
            }
        })
        res.json(info)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const getCostCenter = async (req, res) => {
    try {
        res.json({
            codigo_ccosto: '0111001000101010',
            ccosto: 'AREA ADMINISTRACION'
        })
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const listarAlmacenes = async (req, res) => {
    const { user } = req.headers
    try {
        const almacenes = await UsuarioAlmacenRepository.listarPorId(user.id_user)
        res.json(almacenes).status(200)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}


export const getUsuariosEmpresa = async (req, res) => {
    const { user, company } = req.headers
    const usuario_activo = user.username
    const id_empresa_activo = company.id

    try {
        const users = await Usuario.findAll({
            attributes: [
                ["IdUsuario", "id"],
                "ApellidoPaterno",
                "ApellidoMaterno",
                "Nombres",
                "Correo",
                "NroDocumento",
            ],
            where: {
                IdEmpresa: id_empresa_activo,
                Activo: true
            }
        })
        res.status(200).json(users)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const getUsuarioGrupo = async (req, res) => {
    const { user, company } = req.headers
    const id_usuario_activo = user.id_user
    const usuario_activo = user.username
    const id_empresa_activo = company.id

    const {
        IdUsuarioNivel
    } = req.body

    try {
        const users = await Usuario.findAll({
            attributes: [
                ["IdUsuario", "id"],
                "ApellidoPaterno",
                "ApellidoMaterno",
                "Nombres",
                "Correo",
                "NroDocumento",
            ],
            where: {
                IdEmpresa: id_empresa_activo,
                Activo: true
            },
            include: {
                model: GrupoTrabajador,
                attributes: ["IdUsuarioSubNivel"],
                where: {
                    IdUsuarioNivel: IdUsuarioNivel,
                    Activo: true
                },
                required: false
            },
            order: [
                [Sequelize.col('GrupoTrabajadores.IdUsuarioSubNivel'), 'DESC'],
                ["NroDocumento", "ASC"],
            ],
        })

        const select = users
            .filter(element => element.GrupoTrabajadores.length > 0)
            .map(element => element.toJSON().id)

        res.status(200).json({
            users: users,
            select: select
        })
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const getUsuario = async (req, res) => {
    const { user, company } = req.headers
    const id_empresa_activo = company.id

    const {
        IdUsuario
    } = req.body

    try {
        const user = await Usuario.findOne({
            attributes: [
                "IdUsuario",
                "ApellidoPaterno",
                "ApellidoMaterno",
                "Nombres",
                "Correo",
                "TipoDocumento",
                "NroDocumento",
                "Activo",
                "EsResponsable",
            ],
            where: {
                IdEmpresa: id_empresa_activo,
                IdUsuario: IdUsuario
            }
        })
        res.status(200).json(user)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const updUsuario = async (req, res) => {
    const { user, company } = req.headers

    const id_empresa_activo = company.id
    const id_usuario_activo = user.id_user
    const usuario_activo = user.username

    const {
        IdUsuario,
        nombres,
        apellidoPaterno,
        apellidoMaterno,
        email,
        activo,
        responsable,
    } = req.body

    const resultado = {
        status: 'Ok',
        message: 'Se insertó la solicitud correctamente'
    }

    try {
        const exists = await Usuario.findOne({
            attributes: [
                "IdUsuario"
            ],
            where: {
                IdUsuario: IdUsuario,
                IdEmpresa: id_empresa_activo
            }
        })

        if (!exists) {
            resultado.status = 'Error'
            resultado.message = 'No se encontró usuario'
        } else {
            await Usuario.update({
                ApellidoPaterno: apellidoPaterno,
                ApellidoMaterno: apellidoMaterno,
                Nombres: nombres,
                Activo: activo,
                Correo: email,
                EsResponsable: responsable,
                UsuarioModifica: usuario_activo,
                FechaModifica: new Date()
            }, {
                where: {
                    IdUsuario: IdUsuario,
                    IdEmpresa: id_empresa_activo
                }
            })
        }
        res.status(200).json(resultado)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const insUsuario = async (req, res) => {
    const { user, company } = req.headers

    const id_empresa_activo = company.id
    const id_usuario_activo = user.id_user
    const usuario_activo = user.username

    const {
        nombres,
        apellidoPaterno,
        apellidoMaterno,
        email,
        activo,
        responsable,
        tipoDocumento,
        documento,
    } = req.body

    const resultado = {
        status: 'Ok',
        message: 'Se insertó la solicitud correctamente'
    }

    try {
        const exists = await Usuario.findOne({
            attributes: [
                "IdUsuario"
            ],
            where: {
                NroDocumento: documento,
                IdEmpresa: id_empresa_activo
            }
        })

        if (exists) {
            resultado.status = 'Error'
            resultado.message = 'El documento ya se encuentra registrado'
        } else {
            const new_usuario = await Usuario.create({
                ApellidoPaterno: apellidoPaterno,
                ApellidoMaterno: apellidoMaterno,
                Nombres: nombres,
                Activo: activo,
                Correo: email,
                TipoDocumento: tipoDocumento,
                NroDocumento: documento,
                EsResponsable: responsable,
                UsuarioCreacion: usuario_activo,
                UsuarioModifica: usuario_activo,
                IdEmpresa: id_empresa_activo
            })

            resultado.datos = new_usuario
        }
        res.status(200).json(resultado)
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: e.message });
    }
}