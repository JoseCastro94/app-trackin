import { DataTypes } from "sequelize"
import Sequelize from "sequelize"
import { sequelize } from "../database/database.js"
import { DetalleSolicitudArticulo } from './DetalleSolicitudArticulo.js'
import {DespachoSolicitud} from "./DespachoSolicitud.js";

export const UsuarioNegocio = sequelize.define(
    "UsuarioNegocios",
    {
        IdUsuarioNegocio: {
            type: DataTypes.STRING,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        Nombre: {
            type: DataTypes.STRING,
        },
        Tipo: {
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

UsuarioNegocio.hasMany(DetalleSolicitudArticulo, {
    foreignKey: "IdUsuarioNegocio",
    sourceKey: "IdUsuarioNegocio"
})

DetalleSolicitudArticulo.belongsTo(UsuarioNegocio, {
    foreignKey: "IdUsuarioNegocio",
    targetKey: "IdUsuarioNegocio"
})