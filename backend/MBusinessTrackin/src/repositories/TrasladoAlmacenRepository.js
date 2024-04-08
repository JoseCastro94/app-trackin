import {TransladoAlmacen} from "../models/TransladoAlmacen.js";
import {Almacen} from "../models/Almacen.js";
import {Parametro} from "../models/Parametro.js";
import {DetalleTransladoAlmacen} from "../models/DetalleTransladoAlmacen.js";
import {TipoNegocio} from "../models/TipoNegocio.js";
import Sequelize from "sequelize";

class TrasladoAlmacenRepository {
    static findByPk = async (IdTranslado) => {
        return TransladoAlmacen.findByPk(IdTranslado, {
            attributes: [
                [Sequelize.fn('CONCAT', `TRA-`,
                    Sequelize.col('Periodo'), '-',
                    Sequelize.fn('LPAD', Sequelize.col('Correlativo'), 6, '0')),
                    'codigo'
                ],
                [Sequelize.col('AlmacenOrigen.Nombre'), 'origen'],
                [Sequelize.col('AlmacenDestino.Nombre'), 'destino'],
                [Sequelize.fn('DATE_FORMAT', Sequelize.col('TransladoAlmacenes.FechaRecepcion'), '%d/%m/%Y'), 'fecha'],
                [Sequelize.col('Parametro.Nombre'), 'estado'],
            ],
            include: [{
                model: Almacen,
                as: 'AlmacenOrigen',
                attributes: []
            }, {
                model: Almacen,
                as: 'AlmacenDestino',
                attributes: []
            }, {
                model: Parametro,
                attributes: []
            }, {
                model: DetalleTransladoAlmacen,
                attributes: [
                    [Sequelize.col('ItemCode'), 'codigo'],
                    [Sequelize.col('ItemName'), 'articulo'],
                    [Sequelize.col('Grupo'), 'grupo'],
                    [Sequelize.col('SerialNumber'), 'serie'],
                    [Sequelize.col('CantidadEnviada'), 'cantidad'],
                    [Sequelize.literal('`DetalleTransladoAlmacenes->TipoNegocio`.`Nombre`'), 'negocio'],
                ],
                include: [{
                    model: TipoNegocio,
                    attributes: []
                }]
            }]
        }).then(data => data.toJSON())
    }
}

export default TrasladoAlmacenRepository