import Sequelize, {DataTypes} from "sequelize";
import {sequelize} from "../database/database.js";
import {DetalleHistorialResponsableAlmacen} from "./DetalleHistorialResponsableAlmacen.js";

const columns = {
    IdHistRespoAlmacen: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    Codigo: {
        type: DataTypes.STRING(20),
    },
    DniResponsableIngresa: {
        type: DataTypes.STRING(20),
    },
    FechaInicioResp: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
    FechaFinResp: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
    Estado: {
        type: DataTypes.STRING(20),
    },
    Attachment: {
        type: DataTypes.STRING(100),
    },
    Email: {
        type: DataTypes.STRING(40),
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

export const HistorialResponsableAlmacen = sequelize.define(
    "HistRespoAlmacen",
    columns,
    {
        timestamps: false,
    }
)

HistorialResponsableAlmacen.hasMany(DetalleHistorialResponsableAlmacen, {
    foreignKey: "IdHistRespoAlmacen",
    sourceKey: "IdHistRespoAlmacen"
})

DetalleHistorialResponsableAlmacen.belongsTo(HistorialResponsableAlmacen, {
    foreignKey: "IdHistRespoAlmacen",
    targetKey: "IdHistRespoAlmacen"
})