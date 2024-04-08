import {DetalleDespachoSolicitud} from "./DetalleDespachoSolicitud.js";
import { sequelize } from "../database/database.js";
import {ArchivoAdjunto} from "./ArchivoAdjunto.js";
import { DataTypes } from "sequelize"
import Sequelize from "sequelize"

const columns = {
    IdDespacho: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    Codigo: {
        type: DataTypes.STRING(20),
    },
    FechaProgramada: {
        type: DataTypes.DATE,
    },
    Observacion: {
        type: DataTypes.STRING(200),
    },
    TipoTraslado: {
        type: DataTypes.INTEGER(10),
    },
    Cargo: {
        type: DataTypes.STRING(40),
    },
    Atachment1: {
        type: DataTypes.STRING(40),
    },
    Atachment2: {
        type: DataTypes.STRING(40),
    },
    Tipo: {
        type: DataTypes.STRING(20),
        defaultValue: 'DESPACHO'
    },
    ResponsableAlmacen: {
        type: DataTypes.STRING(100)
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

export const DespachoSolicitud = sequelize.define(
    "DespachoSolicitud",
    columns,
    {
        timestamps: false,
    }
)

DespachoSolicitud.hasMany(DetalleDespachoSolicitud, {
    foreignKey: "IdDespacho",
    sourceKey: "IdDespacho"
})

DetalleDespachoSolicitud.belongsTo(DespachoSolicitud, {
    foreignKey: "IdDespacho",
    targetKey: "IdDespacho"
})
