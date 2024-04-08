import { DataTypes } from "sequelize"
import Sequelize from "sequelize"
import { sequelize } from "../database/database.js"

export const Estado = sequelize.define(
    "Estados",
    {
        IdEstado: {
            type: DataTypes.STRING,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        Tipo: {
            type: DataTypes.STRING,
        },
        UsuarioCreacion: {
            type: DataTypes.STRING,
        },
        FechaCreacion: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
        },
        IdSocilitud: {
            type: DataTypes.STRING
        },
        IdParametro: {
            type: DataTypes.STRING
        },
        IdTransferencia: {
            type: DataTypes.STRING
        }
    },
    {
        timestamps: false,
    }
)