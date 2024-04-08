import { Articulo } from '../models/Articulo.js'
import { Stock } from '../models/Stock.js'
import { Almacen } from '../models/Almacen.js'
import { GrupoArticulo } from '../models/GrupoArticulo.js'
import { ArticuloNegocio } from '../models/ArticuloNegocio.js'
import Sequelize, { Op } from "sequelize"
import { TYPE_STOCK } from '../storage/const.js'
import { Parametro } from '../models/Parametro.js'

//const usuario_activo = "45631343"

export const createArticulo = async (req, res) => {
    const { user } = req.headers
    const usuario_activo = user.username

    const {
        name,
        description,
        type
    } = req.body

    try {
        let newArticulo = await Articulo.create(
            {
                Nombre: name,
                Descripcion: description,
                Tipo: type,
                UsuarioCreacion: usuario_activo,
                UsuarioModifica: usuario_activo
            }
        )
        return res.json(newArticulo)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message,
        })
    }
    res.json("article created")
}

export const getArticulos = async (req, res) => {
    try {
        const articulos = await Articulo.findAll({
            attributes: ["IdAlmacen", "Nombre", "Descripcion", "Activo", "Tipo"],
        })
        res.json(articulos)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const getArticulosUsuario = (tipos) => {
    return async (req, res) => {
        const { company } = req.headers
        const id_empresa_activo = company.id

        try {
            const {
                IdNegocio,
                IdAlmacen,
                hideEmpty
            } = req.body

            let where = {
                Tipo: {
                    [Op.in]: tipos
                }
            }

            if (IdNegocio) {
                where.IdNegocio = IdNegocio
            }

            if (IdAlmacen) {
                where.IdAlmacen = IdAlmacen
            }

            if (hideEmpty) {
                where.Cantidad = {
                    [Op.gt]: 0
                }
            }

            const articulos_almacen = await Almacen.findAll({
                attributes: [
                    ["IdAlmacen", 'CodAlmacen'],
                    ["Nombre", 'Almacen'],
                    [Sequelize.col('Stocks.IdStock'), 'id'],
                    [Sequelize.col('Stocks.Cantidad'), 'Stock'],
                    [Sequelize.col('Stocks.IdNegocio'), 'IdNegocio'],
                    [Sequelize.col('Stocks.Tipo'), 'TipoStock'],
                    [Sequelize.col('Stocks.Articulo.IdArticulo'), 'IdArticulo'],
                    [Sequelize.col('Stocks.Articulo.ItemCode'), 'CodArticulo'],
                    [Sequelize.col('Stocks.Articulo.ItemName'), 'Articulo'],
                    [Sequelize.col('Stocks.Articulo.Codebars'), 'Codebars'],
                    [Sequelize.col('Stocks.Articulo.GrupoArticulo.Nombre'), 'Categoria'],
                    [Sequelize.col('Stocks.Articulo.ArticuloNegocios.IdArticuloNegocio'), 'IdArticuloNegocio'],
                    [Sequelize.col('Stocks.Articulo.GrupoArticulo.U_Devolucion'), 'U_Devolucion'],
                    [Sequelize.col('Stocks.Articulo.GrupoArticulo.U_Evaluacion'), 'U_Evaluacion'],
                    [Sequelize.col('Stocks.Articulo.GrupoArticulo.Nombre'), 'Grupo'],
                    [Sequelize.col('Stocks.Articulo.GrupoArticulo.TieneSerie'), 'TieneSerie'],
                    [Sequelize.col('Stocks.Articulo.Parametro.Nombre'), 'U_BPP_TIPUNMED'],
                ],
                where: {
                    IdEmpresa: id_empresa_activo
                },
                include: {
                    model: Stock,
                    attributes: [],
                    where,
                    include: {
                        model: Articulo,
                        attributes: [],
                        include: [{
                            model: GrupoArticulo,
                            attributes: [],
                            required: true
                        }, {
                            model: ArticuloNegocio,
                            attributes: [],
                            where: {
                                IdNegocio: IdNegocio
                            }
                        }, {
                            model: Parametro,
                            attributes: []
                        }],
                        required: true
                    },
                    required: true
                },
                raw: true,
                order: [[Sequelize.col('Stocks.Articulo.ItemName'), 'ASC']],
            })
            res.json(articulos_almacen)
        } catch (e) {
            console.log(e)
            return res.status(500).json({ message: e.message });
        }
    }
}

export const getGenericArticle = async (req, res) => {
    try {
        const articulos = await Articulo.findAll({
            attributes: [
                ["IdArticulo", "id"],
                "ItemCode",
                "ItemName",
                "Codebars",
                //"U_BPP_TIPUNMED",
                [Sequelize.col('Parametro.Nombre'), 'U_BPP_TIPUNMED'],
            ],
            include: {
                model: Parametro,
                attributes: []
            }
        })
        res.json(articulos)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const getArticles = async (req, res) => {
    const { company } = req.headers
    const id_empresa_activo = company.id

    try {
        const {
            IdNegocio,
            IdAlmacen,
        } = req.body

        const articulos_almacen = await Almacen.findAll({
            attributes: [
                ["IdAlmacen", 'CodAlmacen'],
                ["Nombre", 'Almacen'],
                [Sequelize.col('Stocks.IdStock'), 'id'],
                [Sequelize.col('Stocks.Cantidad'), 'Stock'],
                [Sequelize.col('Stocks.IdNegocio'), 'IdNegocio'],
                [Sequelize.col('Stocks.Tipo'), 'TipoStock'],
                [Sequelize.col('Stocks.Articulo.IdArticulo'), 'IdArticulo'],
                [Sequelize.col('Stocks.Articulo.ItemCode'), 'CodArticulo'],
                [Sequelize.col('Stocks.Articulo.ItemName'), 'Articulo'],
                [Sequelize.col('Stocks.Articulo.Codebars'), 'Codebars'],
                [Sequelize.col('Stocks.Articulo.GrupoArticulo.Nombre'), 'Categoria'],
                [Sequelize.col('Stocks.Articulo.ArticuloNegocios.IdArticuloNegocio'), 'IdArticuloNegocio'],
                [Sequelize.col('Stocks.Articulo.GrupoArticulo.U_Devolucion'), 'U_Devolucion'],
                [Sequelize.col('Stocks.Articulo.GrupoArticulo.U_Evaluacion'), 'U_Evaluacion'],
                [Sequelize.col('Stocks.Articulo.GrupoArticulo.Nombre'), 'Grupo'],
                [Sequelize.col('Stocks.Articulo.GrupoArticulo.TieneSerie'), 'TieneSerie'],
                [Sequelize.col('Stocks.Articulo.Parametro.Nombre'), 'U_BPP_TIPUNMED'],
                ["IdAlmacen", 'IdAlmacen'],
            ],
            where: {
                IdEmpresa: id_empresa_activo,
                IdAlmacen: IdAlmacen
            },
            include: {
                model: Stock,
                attributes: [],
                where: {
                    IdNegocio: IdNegocio,
                    Tipo: {
                        [Op.in]: [
                            TYPE_STOCK.DISPONIBLE,
                            TYPE_STOCK.COMPROMETIDO,
                            TYPE_STOCK.EN_EVALUACION
                        ]
                    }
                },
                include: {
                    model: Articulo,
                    attributes: [],
                    include: [{
                        model: GrupoArticulo,
                        attributes: [],
                        required: true
                    }, {
                        model: ArticuloNegocio,
                        attributes: [],
                        where: {
                            IdNegocio: IdNegocio
                        }
                    }, {
                        model: Parametro,
                        attributes: []
                    }],
                    required: true
                },
                required: true
            },
            raw: true,
            order: [[Sequelize.col('Stocks.Articulo.ItemName'), 'ASC']],
        })
        res.json(articulos_almacen)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const getArticle = async (req, res) => {
    const { company } = req.headers
    const id_empresa_activo = company.id

    const {
        IdNegocio,
        IdAlmacen,
        IdArticulo
    } = req.body

    try {
        const articulos_almacen = await Almacen.findOne({
            attributes: [
                ["IdAlmacen", 'CodAlmacen'],
                ["Nombre", 'Almacen'],
                [Sequelize.col('Stocks.IdStock'), 'id'],
                [Sequelize.col('Stocks.Cantidad'), 'Stock'],
                [Sequelize.col('Stocks.IdNegocio'), 'IdNegocio'],
                [Sequelize.col('Stocks.Tipo'), 'TipoStock'],
                [Sequelize.col('Stocks.Articulo.IdArticulo'), 'IdArticulo'],
                [Sequelize.col('Stocks.Articulo.ItemCode'), 'CodArticulo'],
                [Sequelize.col('Stocks.Articulo.ItemName'), 'Articulo'],
                [Sequelize.col('Stocks.Articulo.Codebars'), 'Codebars'],
                [Sequelize.col('Stocks.Articulo.GrupoArticulo.Nombre'), 'Categoria'],
                [Sequelize.col('Stocks.Articulo.ArticuloNegocios.IdArticuloNegocio'), 'IdArticuloNegocio'],
                [Sequelize.col('Stocks.Articulo.GrupoArticulo.U_Devolucion'), 'U_Devolucion'],
                [Sequelize.col('Stocks.Articulo.GrupoArticulo.U_Evaluacion'), 'U_Evaluacion'],
                [Sequelize.col('Stocks.Articulo.GrupoArticulo.Nombre'), 'Grupo'],
                [Sequelize.col('Stocks.Articulo.GrupoArticulo.TieneSerie'), 'TieneSerie'],
                [Sequelize.col('Stocks.Articulo.Parametro.Nombre'), 'U_BPP_TIPUNMED'],
                ["IdAlmacen", 'IdAlmacen'],
            ],
            where: {
                IdEmpresa: id_empresa_activo,
                IdAlmacen: IdAlmacen,
            },
            include: {
                model: Stock,
                attributes: [],
                where: {
                    IdNegocio: IdNegocio,
                    IdArticulo: IdArticulo,
                    Tipo: {
                        [Op.in]: [
                            TYPE_STOCK.DISPONIBLE,
                            TYPE_STOCK.COMPROMETIDO,
                            TYPE_STOCK.EN_EVALUACION
                        ]
                    }
                },
                include: {
                    model: Articulo,
                    attributes: [],
                    include: [{
                        model: GrupoArticulo,
                        attributes: [],
                        required: true
                    }, {
                        model: ArticuloNegocio,
                        attributes: [],
                        where: {
                            IdNegocio: IdNegocio
                        }
                    }, {
                        model: Parametro,
                        attributes: []
                    }],
                    required: true
                },
                required: true
            },
            raw: true,
            order: [[Sequelize.col('Stocks.Articulo.ItemName'), 'ASC']],
        })
        res.json(articulos_almacen)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}