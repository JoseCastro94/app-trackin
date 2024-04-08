import { DataTypes } from "sequelize"
import Sequelize from "sequelize"
import {sequelize} from "../database/database.js";

const columns = {
    IdUsuarioEmpresa: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    UsuarioCreacion: {
        type: DataTypes.STRING(36),
    },
    FechaCreacion: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
    UsuarioModifica: {
        type: DataTypes.STRING(36),
    },
    FechaModifica: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    }
}

export const UsuarioEmpresa = sequelize.define(
    "UsuarioEmpresa",
    columns,
    {
        timestamps: false,
    }
)