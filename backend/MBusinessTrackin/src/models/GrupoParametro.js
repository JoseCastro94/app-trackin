import { DataTypes } from "sequelize"
import Sequelize from "sequelize"
import { sequelize } from "../database/database.js"
import { Parametro } from "./Parametro.js";

const columns = {
    IdGrupo: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    Nombre: {
        type: DataTypes.STRING(40),
    },
    Descripcion: {
        type: DataTypes.STRING(40),
    },Activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
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

export const GrupoParametro = sequelize.define(
    "GrupoParametro",
    columns,
    {
        timestamps: false,
    }
);

GrupoParametro.hasMany(Parametro, {
    foreignKey: "IdGrupo",
    sourceKey: "IdGrupo"
})

Parametro.belongsTo(GrupoParametro, {
    foreignKey: "IdGrupo",
    targetKey: "IdGrupo"
})