import { sequelize } from "../database/database.js"
import { DataTypes } from "sequelize"
import Sequelize from "sequelize"

const columns = {
    IdArchivo: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    Modulo: {
        type: DataTypes.STRING,
    },
    IdModulo: {
        type: DataTypes.STRING,
    },
    Key: {
        type: DataTypes.STRING,
    },
    Nombre: {
        type: DataTypes.STRING,
    },
    Ext: {
        type: DataTypes.STRING,
    },
    Mime: {
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
        type: DataTypes.DATE
    }
}

export const ArchivoAdjunto = sequelize.define(
    "ArchivoAdjuntos",
    columns,
    {
        timestamps: false,
    }
)