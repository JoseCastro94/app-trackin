import {Incidente} from "../models/Incidente.js";
import {Almacen} from "../models/Almacen.js";
import {TipoNegocio} from "../models/TipoNegocio.js";
import {Articulo} from "../models/Articulo.js";
import {Parametro} from "../models/Parametro.js";
import Sequelize from "sequelize";

class IncidenteRepository {
    static findById = async (IdIncidente) => {
        return Incidente.findByPk(IdIncidente, {
            attributes: [
                [Sequelize.fn('CONCAT', `INC-`,
                    Sequelize.col('Periodo'), '-',
                    Sequelize.fn('LPAD', Sequelize.col('Correlativo'), 6, '0')),
                    'codigo'
                ],
                ['Comentario', 'comentario'],
                ['SerialNumber', 'serie'],
                [Sequelize.col('Almacene.Nombre'), 'almacen'],
                [Sequelize.col('TipoNegocio.Nombre'), 'negocio'],
                [Sequelize.col('Articulo.ItemCode'), 'codigo_articulo'],
                [Sequelize.col('Articulo.ItemName'), 'articulo'],
                [Sequelize.col('Parametro.Nombre'), 'estado'],
                [Sequelize.col('Tipo.Nombre'), 'incidente'],
            ],
            include: [{
                model: Almacen,
                attributes: []
            }, {
                model: TipoNegocio,
                attributes: []
            }, {
                model: Articulo,
                attributes: []
            }, {
                model: Parametro,
                attributes: []
            }, {
                model: Parametro,
                as: 'Tipo',
                attributes: []
            }]
        }).then(incidente => incidente.toJSON())
    }
}

export default IncidenteRepository