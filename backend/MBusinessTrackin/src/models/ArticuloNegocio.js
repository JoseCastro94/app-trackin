import { DataTypes } from "sequelize"
import Sequelize from "sequelize"
import { sequelize } from "../database/database.js"
import { DetalleSolicitudArticulo } from './DetalleSolicitudArticulo.js'

export const ArticuloNegocio = sequelize.define(
    "ArticuloNegocios",
    {
        IdArticuloNegocio: {
            type: DataTypes.STRING,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        Nombre: {
            type: DataTypes.STRING,
        },
        Descripcion: {
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

ArticuloNegocio.hasMany(DetalleSolicitudArticulo, {
    foreignKey: "IdArticuloNegocio",
    sourceKey: "IdArticuloNegocio"
})

DetalleSolicitudArticulo.belongsTo(ArticuloNegocio, {
    foreignKey: "IdArticuloNegocio",
    targetKey: "IdArticuloNegocio"
})