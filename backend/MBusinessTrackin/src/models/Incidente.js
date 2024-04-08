import { DataTypes } from "sequelize"
import Sequelize from "sequelize"
import { sequelize } from "../database/database.js"

import { IncidenteAdjunto } from './IncidenteAdjunto.js'
import { TransacAlmacen } from './TransacAlmacen.js'

export const Incidente = sequelize.define(
    "Incidentes",
    {
        IdIncidente: {
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
        Cantidad: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        Comentario: {
            type: DataTypes.STRING,
        },
        SerialNumber: {
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

Incidente.hasMany(IncidenteAdjunto, {
    foreignKey: "IdIncidente",
    sourceKey: "IdIncidente"
})

IncidenteAdjunto.belongsTo(Incidente, {
    foreignKey: "IdIncidente",
    targetKey: "IdIncidente"
})

Incidente.hasMany(TransacAlmacen, {
    foreignKey: "IdIncidente",
    sourceKey: "IdIncidente"
})

TransacAlmacen.belongsTo(Incidente, {
    foreignKey: "IdIncidente",
    targetKey: "IdIncidente"
})