import { DataTypes } from "sequelize"
import Sequelize from "sequelize"
import { sequelize } from "../database/database.js"
import { Articulo } from './Articulo.js'
import { ControlSerie } from "./ControlSerie.js";

export const GrupoArticulo = sequelize.define(
    "GrupoArticulos",
    {
        IdGrupoArticulo: {
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

GrupoArticulo.hasMany(Articulo, {
    foreignKey: "IdGrupoArticulo",
    sourceKey: "IdGrupoArticulo"
})

Articulo.belongsTo(GrupoArticulo, {
    foreignKey: "IdGrupoArticulo",
    targetKey: "IdGrupoArticulo"
})

GrupoArticulo.hasMany(ControlSerie, {
    foreignKey: "IdGrupoArticulo",
    sourceKey: "IdGrupoArticulo"
})

ControlSerie.belongsTo(GrupoArticulo, {
    foreignKey: "IdGrupoArticulo",
    targetKey: "IdGrupoArticulo"
})
