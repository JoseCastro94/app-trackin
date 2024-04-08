import { DataTypes } from "sequelize"
import Sequelize from "sequelize"
import { sequelize } from "../database/database.js"
import { DetalleTransladoAlmacen } from "./DetalleTransladoAlmacen.js"

export const TransladoAlmacen = sequelize.define(
    "TransladoAlmacenes",
    {
        IdTranslado: {
            type: DataTypes.STRING,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        FechaTranslado: {
            type: DataTypes.DATE,
        },
        FechaRecepcion: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
        },
        Periodo: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        Correlativo: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        Observacion: {
            type: DataTypes.STRING,
            defaultValue: ''
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

TransladoAlmacen.hasMany(DetalleTransladoAlmacen, {
    foreignKey: "IdTranslado",
    sourceKey: "IdTranslado"
})

DetalleTransladoAlmacen.belongsTo(TransladoAlmacen, {
    foreignKey: "IdTranslado",
    targetKey: "IdTranslado"
})