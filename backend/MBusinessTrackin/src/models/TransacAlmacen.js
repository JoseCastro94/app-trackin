import { DataTypes } from "sequelize"
import Sequelize from "sequelize"
import { sequelize } from "../database/database.js"

const columns = {
    IdTransac: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    IdTipoTransac: {
        type: DataTypes.STRING(10),
    },
    ItemCode: {
        type: DataTypes.STRING,
    },
    ItemName: {
        type: DataTypes.STRING(100),
    },
    Nombre_GrupArt: {
        type: DataTypes.STRING(50),
    },
    U_Devolicion: {
        type: DataTypes.STRING(10),
    },
    U_DiasDevolicion: {
        type: DataTypes.INTEGER(10),
    },
    Cantidad: {
        type: DataTypes.INTEGER(10),
    },
    Tipo: {
        type: DataTypes.STRING(50),
    },
    Importe: {
        type: DataTypes.DECIMAL(10, 1),
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

export const TransacAlmacen = sequelize.define(
    "TransacAlmacen",
    columns,
    {
        timestamps: false,
    }
)
