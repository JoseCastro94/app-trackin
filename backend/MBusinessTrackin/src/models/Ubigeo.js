import {EmpresaParametro} from "./EmpresaParametro.js"
import { sequelize } from "../database/database.js"
import { DataTypes } from "sequelize"
import {Almacen} from "./Almacen.js"
import Sequelize from "sequelize"

export const Ubigeo = sequelize.define(
    "Ubigeo",
    {
        id_ubigeo: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
        },
        ubigeo_reniec: {
            type: DataTypes.STRING(300),
        },
        ubigeo_inei: {
            type: DataTypes.STRING(300),
        },
        departamento_inei: {
            type: DataTypes.STRING(300),
        },
        departamento: {
            type: DataTypes.STRING(300),
        },
        provincia_inei: {
            type: DataTypes.STRING(300),
        },
        provincia: {
            type: DataTypes.STRING(300),
        },
        distrito: {
            type: DataTypes.STRING(300),
        },
        region: {
            type: DataTypes.STRING(300),
        },
        macroregion_inei: {
            type: DataTypes.STRING(300),
        },
        macroregion_minsa: {
            type: DataTypes.STRING(300),
        },
        iso_3166_2: {
            type: DataTypes.STRING(300),
        },
        fips: {
            type: DataTypes.STRING(300),
        },
        superficie: {
            type: DataTypes.STRING(300),
        },
        altitud: {
            type: DataTypes.STRING(300),
        },
        latitud: {
            type: DataTypes.STRING(300),
        },
        longitud: {
            type: DataTypes.STRING(300),
        },
        Pais: {
            type: DataTypes.STRING(100),
        },
    },
    {
        timestamps: false,
    }
)

Ubigeo.hasMany(Almacen, {
    foreignKey: "IdUbigeo",
    sourceKey: "id_ubigeo"
})

Almacen.belongsTo(Ubigeo, {
    foreignKey: "IdUbigeo",
    targetKey: "id_ubigeo"
})

Ubigeo.hasMany(EmpresaParametro, {
    foreignKey: "IdUbigeo",
    sourceKey: "id_ubigeo"
})

EmpresaParametro.belongsTo(Ubigeo, {
    foreignKey: "IdUbigeo",
    targetKey: "id_ubigeo"
})