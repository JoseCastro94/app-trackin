import { ControlSerie } from '../models/ControlSerie.js'
import { Articulo } from '../models/Articulo.js'
import { TipoNegocio } from '../models/TipoNegocio.js'
import { Almacen } from '../models/Almacen.js'
import Sequelize, { Op } from "sequelize"
import { ESTADO_CONTROL_SERIE, TYPE_STOCK, STATUS_CONTROL_SERIE } from '../storage/const.js'

export const getListByWarehouse = async (req, res) => {
    try {
        const {
            IdAlmacen
        } = req.body
        const controlseries = await ControlSerie.findAll({
            attributes: [
                ["IdControlSerie", "id"],
                ["SerialNumber", "SerialNumber"],
                ["IdAlmacen", "IdAlmacen"],
                ["IdNegocio", "IdNegocio"],
                ["IdArticulo", "IdArticulo"],
                ["IdGrupoArticulo", "IdGrupoArticulo"],
                [Sequelize.col('Articulo.ItemCode'), "ItemCode"],
                [Sequelize.col('Articulo.ItemName'), "ItemName"],
                [Sequelize.col('TipoNegocio.Nombre'), "Negocio"],
                [Sequelize.col('Almacene.Nombre'), "Almacen"],
            ],
            where: {
                IdEstado: ESTADO_CONTROL_SERIE.DISPONIBLE,
                IdAlmacen
            },
            include: [{
                model: Articulo,
                attributes: [],
            },
            {
                model: TipoNegocio,
                attributes: [],
            }, {
                model: Almacen,
                attributes: [],
            }]
        })
        res.json(controlseries)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const getListByArticle = async (req, res) => {
    try {
        console.dir('getListByArticle');
        const {
            IdNegocio,
            IdAlmacen,
            IdArticulo,
        } = req.body

        console.dir('IdNegocio: ' + IdNegocio);
        console.dir('IdAlmacen: ' + IdAlmacen);
        console.dir('IdArticulo: ' + IdArticulo);
        const controlseries = await ControlSerie.findAll({
            attributes: [
                ["IdControlSerie", "id"],
                ["SerialNumber", "SerialNumber"],
                ["IdAlmacen", "IdAlmacen"],
                ["IdNegocio", "IdNegocio"],
                ["IdArticulo", "IdArticulo"],
                ["IdGrupoArticulo", "IdGrupoArticulo"],
            ],
            where: {
                IdEstado: ESTADO_CONTROL_SERIE.DISPONIBLE,
                IdNegocio,
                IdAlmacen,
                IdArticulo,
            }
        })

        console.dir(controlseries);
        res.json(controlseries)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export const getListByStockType = async (req, res) => {
    const {
        IdAlmacen,
        IdNegocio,
        IdArticulo,
        Tipo
    } = req.body

    try {
        const estados = []

        switch (Tipo) {
            case TYPE_STOCK.DISPONIBLE:
                estados.push(STATUS_CONTROL_SERIE.DISPONIBLE)
                break
            case TYPE_STOCK.COMPROMETIDO:
                break
            case TYPE_STOCK.EN_EVALUACION:
                estados.push(STATUS_CONTROL_SERIE.REPARACION)
                break
            case TYPE_STOCK.NO_DISPONIBLE:
                estados.push(STATUS_CONTROL_SERIE.DE_BAJA)
                estados.push(STATUS_CONTROL_SERIE.MALOGRADO)
                estados.push(STATUS_CONTROL_SERIE.PERDIDO)
                break
        }

        const controlseries = await ControlSerie.findAll({
            attributes: [
                ["IdControlSerie", "id"],
                ["SerialNumber", "SerialNumber"],
                [Sequelize.col('TipoNegocio.Nombre'), "Negocio"],
                [Sequelize.col('Articulo.ItemCode'), "ItemCode"],
                [Sequelize.col('Articulo.ItemName'), "ItemName"],
            ],
            include: [
                {
                    model: Articulo,
                    attributes: []
                }, {
                    model: TipoNegocio,
                    attributes: []
                }
            ],
            where: {
                IdAlmacen,
                IdNegocio,
                IdArticulo,
                IdEstado: {
                    [Op.in]: estados
                }
            }
        })
        res.json(controlseries)
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}