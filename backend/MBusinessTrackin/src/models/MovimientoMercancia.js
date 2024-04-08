import {DetalleMovimientoMercancia} from "./DetalleMovimientoMercancia.js";
import {sequelize} from "../database/database.js";
import {ControlSerie} from "./ControlSerie.js";
import Sequelize, {DataTypes} from "sequelize";

const columns = {
    IdEntradaMercancia: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    Codigo: {
        type: DataTypes.STRING(20),
    },
    DocReference: {
        type: DataTypes.STRING(40),
    },
    Ruc: {
        type: DataTypes.STRING(11),
    },
    RazonSocial: {
        type: DataTypes.STRING(200),
    },
    Attach1: {
        type: DataTypes.STRING,
    },
    Attach2: {
        type: DataTypes.STRING,
    },
    Correos: {
        type: DataTypes.STRING(200),
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

export const MovimientoMercancia = sequelize.define(
    "MovimientoMercancia",
    columns,
    {
        timestamps: false,
    }
)

MovimientoMercancia.hasMany(DetalleMovimientoMercancia, {
    foreignKey: "IdEntradaMercancia",
    sourceKey: "IdEntradaMercancia"
})

DetalleMovimientoMercancia.belongsTo(MovimientoMercancia, {
    foreignKey: "IdEntradaMercancia",
    targetKey: "IdEntradaMercancia"
})

MovimientoMercancia.hasMany(ControlSerie, {
    foreignKey: "IdEntradaMercancia",
    sourceKey: "IdEntradaMercancia"
})

ControlSerie.belongsTo(MovimientoMercancia, {
    foreignKey: "IdEntradaMercancia",
    targetKey: "IdEntradaMercancia"
})