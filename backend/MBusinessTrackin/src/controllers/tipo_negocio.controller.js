import Sequelize, { Op } from "sequelize"
import { TipoNegocio } from '../models/TipoNegocio.js'
import { UsuarioNegocio } from '../models/UsuarioNegocio.js'
import { Stock } from "../models/Stock.js"
import { Almacen } from "../models/Almacen.js"
import { EmpresaParametro } from "../models/EmpresaParametro.js"

import fetch from 'node-fetch'
import { UsuarioAlmacen } from "../models/UsuarioAlmacen.js"
import { Usuario } from "../models/Usuario.js"

//const usuario_activo = "45631343"
//const id_empresa_activo = "38d7f59f-5790-4853-afdc-f8bbc0c2eca0"

export const createTipoNegocio = async (req, res) => {
    const { user } = req.headers
    const usuario_activo = user.username

    const {
        name,
        description,
        type
    } = req.body

    try {
        let newTipoNegocio = await TipoNegocio.create(
            {
                Nombre: name,
                Descripcion: description,
                Tipo: type,
                UsuarioCreacion: usuario_activo,
                UsuarioModifica: usuario_activo
            }
        )
        return res.json(newTipoNegocio)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message,
        })
    }
    res.json("warehouse created")
}

export const getTipoNegocios = async (req, res) => {
    try {
        const tipo_negocios = await TipoNegocio.findAll({
             attributes: ["IdNegocio", "Nombre","Activo", "Tipo", "IdEmpresa"],
        })
        res.json(tipo_negocios)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const getTipoNegocioUsuario = async (req, res) => {
    const { user, company, almacen  } = req.headers
    const id_empresa_activo = company.id
    let id_usuario_activo = user.id_user

    if (req.body.IdUsuario) {
        id_usuario_activo = req.body.IdUsuario
    }

    try {
        const tipo_negocio_usuario = await TipoNegocio.findAll({
            attributes: ["IdNegocio", "Nombre", "Tipo"],
            where: {
                Activo: true,
                IdEmpresa: id_empresa_activo
            },
            include: {
                model: UsuarioNegocio,
                where: {
                    IdUsuario: id_usuario_activo
                },
                attributes: ["IdUsuarioNegocio"]
            },
            order: [["Nombre", 'ASC']],
        })
        res.json(tipo_negocio_usuario)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const getTipoNegocioStocks = async (req, res) => {
    const { user, company  } = req.headers
    const id_empresa_activo = company.id
    let id_usuario_activo = user.id_user
    
        const tipo_negocio_usuario = await TipoNegocio.findAll({
            attributes: ['IdNegocio', 'Nombre'],
            include: {
                model: Stock,
                where: {
                 IdAlmacen: req.body.IdAlmacen
                },
            },
            where: {
                IdEmpresa: id_empresa_activo,
              },
              group: ['TipoNegocio.IdNegocio', 'TipoNegocio.Nombre'],
        })
        res.json(tipo_negocio_usuario)

}

export const getStockNegocios = async (req, res) => {
    const { company, user } = req.headers;
    const id_empresa_activo = company.id;
    const id_usuario_activo = user.id_user;
  
    try {
        const negocios_stock = await TipoNegocio.findAll({
            attributes: [["IdNegocio", "id" ], ["Nombre", "nombre"]],
            include: [
                {
                    model: EmpresaParametro,
                    attributes: [], 
                    required: true,
                    where: {
                        IdEmpresa: id_empresa_activo,
                    },
                },
                {
                    model: Stock,
                    attributes: [], 
                    required: true,
                    include: [
                        {
                            model: Almacen,
                            attributes: [], 
                            required: true,
                            include: [
                                {
                                    model: UsuarioAlmacen,
                                    attributes: [], 
                                    required: true,
                                    include: [
                                        {
                                            model: Usuario,
                                            attributes: [], 
                                            required: true,
                                            where: {
                                                IdUsuario: id_usuario_activo,
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
            group: ['TipoNegocio.Nombre'], // Agrupa por el nombre del negocio
        });
      res.json(negocios_stock);
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  };


export const getTipoNegocioAll = async (req, res) => {
    const { user, company } = req.headers
    const id_empresa_activo = company.id
    let id_usuario_activo = user.id_user

    // if (req.body.IdUsuario) {
    //     id_usuario_activo = req.body.IdUsuario
    // }

    try {
        const tipo_negocio_usuario = await TipoNegocio.findAll({
            attributes: ["IdNegocio", "Nombre", "Tipo"],
            where: {
                Activo: true,
                IdEmpresa: id_empresa_activo
            },
            order: [["Nombre", 'ASC']],
        })
        res.json(tipo_negocio_usuario)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const getTipoNegocio = async (req, res) => {
    const { company } = req.headers
    const id_empresa_activo = company.id

    try {
        const tipos_negocio = await TipoNegocio.findAll({
            attributes: ["IdNegocio", "Nombre", "Tipo"],
            where: {
                Activo: true,
                IdEmpresa: id_empresa_activo
            },
            order: [['Nombre', 'ASC']],
        })
        res.json(tipos_negocio)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const findApi = async (req, res) => {
    try {
        const {
            ruc,
            dni
        } = req.body

        const service = ruc ? 'ruc' : 'dni'

        fetch(`${process.env.API_MIGO}/api/v1/${service}`, {
            method: 'POST',
            body: JSON.stringify({
                token: process.env.TOKEN_MIGO,
                ruc,
                dni
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(response => {
                res.json(response).status(200)
            })
            .catch(error => res.status(500).json({ message: error.message }))
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const getUsuarioTipoNegocio = async (req, res) => {
    const { user, company } = req.headers
    const id_usuario_activo = user.id_user
    const usuario_activo = user.username
    const id_empresa_activo = company.id

    const {
        IdUsuario
    } = req.body

    try {
        const negocios = await TipoNegocio.findAll({
            attributes: [
                ["IdNegocio", "id"],
                "Nombre",
            ],
            where: {
                IdEmpresa: id_empresa_activo,
                Activo: true
            },
            include: {
                model: UsuarioNegocio,
                attributes: ["IdUsuarioNegocio"],
                where: {
                    IdUsuario: IdUsuario,
                },
                required: false
            },
            order: [
                [Sequelize.col('UsuarioNegocios.IdUsuarioNegocio'), 'DESC'],
                ["Nombre", "ASC"],
            ],
        })

        const select = negocios
            .filter(element => element.UsuarioNegocios.length > 0)
            .map(element => element.toJSON().id)

        res.status(200).json({
            negocios: negocios,
            select: select
        })
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}