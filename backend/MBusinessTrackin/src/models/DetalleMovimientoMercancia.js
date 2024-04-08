import {sequelize} from "../database/database.js";
import Sequelize, {DataTypes} from "sequelize";

const columns = {
    IdDetalleMercancia: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    ItemName: {
        type: DataTypes.STRING(200),
    },
    Nombre_GrupArt: {
        type: DataTypes.STRING(50),
    },
    U_BPP_TIPUNMED: {
        type: DataTypes.STRING(10),
    },
    U_Devolicion: {
        type: DataTypes.STRING(10),
    },
    U_DiasDevolicion: {
        type: DataTypes.INTEGER(10),
    },
    CodeBars: {
        type: DataTypes.INTEGER(10),
    },
    Cantidad: {
        type: DataTypes.INTEGER(10),
    },
    Importe: {
        type: DataTypes.DECIMAL(10, 1),
    },
    Observacion: {
        type: DataTypes.STRING(200),
    },
    Categoria: {
        type: DataTypes.STRING(200),
    },
    Almacen: {
        type: DataTypes.STRING(200),
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

export const DetalleMovimientoMercancia = sequelize.define(
    "DetalleMovimientoMercancia",
    columns,
    {
        timestamps: false,
    }
)