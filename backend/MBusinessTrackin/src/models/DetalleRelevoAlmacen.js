import { DataTypes } from "sequelize"
import Sequelize from "sequelize"
import { sequelize } from "../database/database.js"
import { Incidente } from './Incidente.js'

export const DetalleRelevoAlmacen = sequelize.define(
    "DetalleRelevoAlmacen",
    {
        IdDetalleRelevoAlmacen: {
            type: DataTypes.STRING,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        Cantidad: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        Tipo: {
            type: DataTypes.STRING,
        },
        CodigoArticulo: {
            type: DataTypes.STRING,
        },
        DescripcionArticulo: {
            type: DataTypes.STRING,
        },
        CategoriaArticulo: {
            type: DataTypes.STRING,
        },
        Negocio: {
            type: DataTypes.STRING,
        },
        Check: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        IsControlSerie: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        UsuarioCreacion: {
            type: DataTypes.STRING,
        },
        FechaCreacion: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
        },
        UsuarioModifica: {
            type: DataTypes.STRING,
        },
        FechaModifica: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
        }
    },
    {
        timestamps: false,
    }
)

DetalleRelevoAlmacen.hasMany(Incidente, {
    foreignKey: "IdDetalleRelevoAlmacen",
    sourceKey: "IdDetalleRelevoAlmacen"
})

Incidente.belongsTo(DetalleRelevoAlmacen, {
    foreignKey: "IdDetalleRelevoAlmacen",
    targetKey: "IdDetalleRelevoAlmacen"
})