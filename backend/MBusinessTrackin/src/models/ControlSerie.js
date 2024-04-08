import { DataTypes } from "sequelize"
import Sequelize from "sequelize"
import {sequelize} from "../database/database.js";

const columns = {
    IdControlSerie: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    SerialNumber: {
        type: DataTypes.STRING(50),
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

export const ControlSerie = sequelize.define(
    "ControlSerie",
    columns,
    {
        timestamps: false,
    }
)