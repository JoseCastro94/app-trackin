import { DataTypes } from "sequelize"
import Sequelize from "sequelize"
import { sequelize } from "../database/database.js"

import { EvaluacionAdjunto } from '../models/EvaluacionAdjunto.js'

export const EvaluacionArticulo = sequelize.define(
    "EvaluacionArticulos",
    {
        IdEvaluacion: {
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
        FechaEvaluacion: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
        },
        Comentario: {
            type: DataTypes.STRING,
        },
        Cantidad: {
            type: DataTypes.INTEGER,
            defaultValue: 0
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

EvaluacionArticulo.hasMany(EvaluacionAdjunto, {
    foreignKey: "IdEvaluacion",
    sourceKey: "IdEvaluacion"
})

EvaluacionAdjunto.belongsTo(EvaluacionArticulo, {
    foreignKey: "IdEvaluacion",
    targetKey: "IdEvaluacion"
})