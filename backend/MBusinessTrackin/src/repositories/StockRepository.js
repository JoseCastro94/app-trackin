import {Stock} from "../models/Stock.js";
import {Articulo} from "../models/Articulo.js";
import {TipoNegocio} from "../models/TipoNegocio.js";
import {Sequelize, Op} from "sequelize";
import {GrupoArticulo} from "../models/GrupoArticulo.js";
import {ControlSerie} from "../models/ControlSerie.js";

class StockRepository {
    static buscar = async (IdAlmacen, IdNegocio, IdArticulo, Tipo = 'DISPONIBLE') => {
        return Stock.findOne({
            attributes: [
                ['Cantidad', 'cantidad']
            ],
            where: {
                Tipo,
                IdAlmacen,
                IdNegocio,
                IdArticulo
            },
            raw: true
        })
    }

    static buscarPorAlmacen = async (IdAlmacen) => {
        return Stock.findOne({
            attributes: [
                ['Cantidad', 'cantidad']
            ],
            where: {
                IdAlmacen
            },
            raw: true
        })
    }

    
    static buscarPorId = async (IdArticulo) => {
        return Stock.findOne({
            attributes: [
                ['Cantidad', 'cantidad']
            ],
            where: {
                IdArticulo:IdArticulo,

            },
            raw: true
        })
    }

    static listar = async (filter) => {
        const where = filter ? filter : {}
        return Stock.findAll({
            attributes: [
                [Sequelize.literal('row_number() over () - 1'), 'index'],
                [Sequelize.col('Stocks.IdNegocio'), 'id_negocio'],
                [Sequelize.col('Stocks.IdArticulo'), 'id_articulo'],
                [Sequelize.col('Stocks.IdAlmacen'), 'id_almacen'],
                [Sequelize.col('IdStock'), 'id_stock'],
                [Sequelize.literal('IF(`Articulo->GrupoArticulo`.`TieneSerie`, 1, `Stocks`.`Cantidad`)'), 'stock'],
                [Sequelize.literal('IF(`Articulo->GrupoArticulo`.`TieneSerie`, 1, `Stocks`.`Cantidad`)'), 'cantidad'],
                [Sequelize.col('Stocks.Tipo'), 'estado'],
                [Sequelize.col('Articulo.ItemCode'), 'codigo'],
                [Sequelize.col('Articulo.ItemName'), 'descripcion'],
                [Sequelize.col('Articulo.U_BPP_TIPUNMED'), 'unidad_medida'],
                [Sequelize.col('TipoNegocio.Nombre'), 'negocio'],
                [Sequelize.col('Articulo.GrupoArticulo.Nombre'), 'categoria'],
                [Sequelize.col('Articulo.GrupoArticulo.TieneSerie'), 'has_serie'],
                [Sequelize.col('Articulo.ControlSeries.IdControlSerie'), 'id_serie'],
                [Sequelize.col('Articulo.ControlSeries.SerialNumber'), 'serie'],
                [Sequelize.col('Articulo.GrupoArticulo.U_Devolucion'), 'devolucion'],
                [Sequelize.col('Articulo.GrupoArticulo.U_DiasEntrega'), 'dias_entrega'],
                [Sequelize.col('Articulo.GrupoArticulo.U_Evaluacion'), 'evaluacion'],
                [Sequelize.literal('false'), 'checked'],
                [Sequelize.literal('false'), 'incidencia'],
            ],
            where,
            include: [{
                model: TipoNegocio,
                attributes: [],
                required: true
            },{
                model: Articulo,
                attributes: [],
                required: true,
                include: [{
                    model: GrupoArticulo,
                    attributes: [],
                    required: true
                },{
                    model: ControlSerie,
                    attributes: [],
                    required: false,
                    where: Sequelize.literal('`Articulo->ControlSeries`.`IdAlmacen` = `Stocks`.`IdAlmacen`' +
                        'AND `Articulo->ControlSeries`.`IdNegocio` = `Stocks`.`IdNegocio`' +
                        'AND `Articulo->ControlSeries`.`IdGrupoArticulo` = `Articulo->GrupoArticulo`.`IdGrupoArticulo`')
                }]
            }],
            raw: true
        })
    }

    static listarEstados = async () => {
        return Stock.findAll({
            attributes: [
                ['Tipo', 'nombre']
            ],
            where: {
                Tipo: {[Op.ne]: 'ASIGNADO'}
            },
            group: 'Tipo',
            order: ['Tipo'],
            raw: true
        })
    }
}

export default StockRepository
