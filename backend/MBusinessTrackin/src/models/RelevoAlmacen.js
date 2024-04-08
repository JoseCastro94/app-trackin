import { DataTypes } from "sequelize"
import Sequelize from "sequelize"
import { sequelize } from "../database/database.js"
import { DetalleRelevoAlmacen } from './DetalleRelevoAlmacen.js'
import { RelevoAdjunto } from './RelevoAdjunto.js'

export const RelevoAlmacen = sequelize.define(
    "RelevoAlmacen",
    {
        IdRelevoAlmacen: {
            type: DataTypes.STRING,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        Periodo: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        Correlativo: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        FechaInicio: {
            type: DataTypes.DATE,
        },
        FechaFin: {
            type: DataTypes.DATE,
        },
        Comentario: {
            type: DataTypes.STRING,
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

RelevoAlmacen.hasMany(DetalleRelevoAlmacen, {
    foreignKey: "IdRelevoAlmacen",
    sourceKey: "IdRelevoAlmacen"
})

DetalleRelevoAlmacen.belongsTo(RelevoAlmacen, {
    foreignKey: "IdRelevoAlmacen",
    targetKey: "IdRelevoAlmacen"
})

RelevoAlmacen.hasMany(RelevoAdjunto, {
    foreignKey: "IdRelevoAlmacen",
    sourceKey: "IdRelevoAlmacen"
})

RelevoAdjunto.belongsTo(RelevoAlmacen, {
    foreignKey: "IdRelevoAlmacen",
    targetKey: "IdRelevoAlmacen"
})