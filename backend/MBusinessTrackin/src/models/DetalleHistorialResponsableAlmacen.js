import {sequelize} from "../database/database.js";
import Sequelize, {DataTypes} from "sequelize";

const columns = {
    IdDetHistRespoAlmacen: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    ItemName: {
        type: DataTypes.STRING(100),
    },
    ItemCode: {
        type: DataTypes.STRING,
    },
    Nombre_GrupArt: {
        type: DataTypes.STRING(40),
    },
    EstadoStock: {
        type: DataTypes.STRING(40),
    },
    CantidadStock: {
        type: DataTypes.INTEGER(),
    },
    CantidadRecibida: {
        type: DataTypes.INTEGER(),
    },
    SerialNumber: {
        type: DataTypes.STRING(40),
    },
    Incidencia: {
        type: DataTypes.BOOLEAN,
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

export const DetalleHistorialResponsableAlmacen = sequelize.define(
    "DetHistRespoAlmacen",
    columns,
    {
        timestamps: false,
    }
)