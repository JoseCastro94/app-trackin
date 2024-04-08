import { DataTypes } from "sequelize"
import Sequelize from "sequelize"
import { sequelize } from "../database/database.js"

export const UsuarioAlmacen = sequelize.define(
    "UsuarioAlmacenes",
    {
        IdUsuarioAlmacen: {
            type: DataTypes.STRING,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        Observacion: {
            type: DataTypes.STRING,
        },
        CargoRelevo: {
            type: DataTypes.STRING,
        },
        IsAdmin: {
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