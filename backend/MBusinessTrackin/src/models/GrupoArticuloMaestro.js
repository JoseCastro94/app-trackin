import { DataTypes } from "sequelize"
import Sequelize from "sequelize"
import { sequelize } from "../database/database.js"
import { GrupoArticulo } from './GrupoArticulo.js'

export const GrupoArticuloMaestro = sequelize.define(
    "GrupoArticuloMaestros",
    {
        IdGrupoArticuloMaestro: {
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
        U_Devolucion: {
            type: DataTypes.STRING,
        },
        U_DiasEntrega: {
            type: DataTypes.INTEGER,
        },
        U_Evaluacion: {
            type: DataTypes.STRING,
        },
        TieneSerie: {
            type: DataTypes.BOOLEAN,
        },
        Activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
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

GrupoArticuloMaestro.hasMany(GrupoArticulo, {
    foreignKey: "IdGrupoArticuloMaestro",
    sourceKey: "IdGrupoArticuloMaestro"
})

GrupoArticulo.belongsTo(GrupoArticuloMaestro, {
    foreignKey: "IdGrupoArticuloMaestro",
    targetKey: "IdGrupoArticuloMaestro"
})