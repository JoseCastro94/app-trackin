import { DataTypes } from "sequelize"
import Sequelize from "sequelize"
import { sequelize } from "../database/database.js"

export const GrupoTrabajador = sequelize.define(
    "GrupoTrabajadores",
    {
        IdGrupoTrabajador: {
            type: DataTypes.STRING,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        Activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        Observacion: {
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